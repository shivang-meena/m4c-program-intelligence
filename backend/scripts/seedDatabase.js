
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dns = require("dns");

// Smart trick for MongoDB Atlas connectivity issues
dns.setServers(["1.1.1.1", "8.8.8.8"]);
// import models
const SchoolResponse = require('../models/SchoolResponse');
const GrantProfile = require('../models/GrantProfile');
const GrantPerformance = require('../models/GrantPerformance');
const EvidenceMedia = require('../models/EvidenceMedia');

// helper function to parse csvs files and return an array of objects
const parseCSV = (fileName, mapRowFn) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, '../data/raw_csvs', fileName);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Warning: File not found - ${fileName}`);
      return resolve([]);
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(mapRowFn(data)))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

const seedDatabase = async () => {
  try {
    // 1. connect to mongodb
    await mongoose.connect(process.env.MONGO_URI);
    console.log('ok Connected to MongoDB. Starting database seed...');

    // 2 clear existing collections to prevent duplicate data on reruns
    await SchoolResponse.deleteMany();
    await GrantProfile.deleteMany();
    await GrantPerformance.deleteMany();
    await EvidenceMedia.deleteMany();
    console.log('Cleared existing collections.');

    // 3. define row mappers
    // matches the long csvs column names to your clean mongoose schema fields
    const mapSchoolRow = (row) => ({
      reporting_month: row['Reporting Month'],
      school_name: row['What is the name of your school?'],
      school_code: row["What is your school's synthetic school code?"],
      district: row['What is the name of your district?'],
      block: row['Block Details'],
      pbl_conducted: row['Was the PBL project conducted in your school this month?'],
      evidence_submitted: row['Was evidence submitted for the completed PBL project?'],
      classes_conducted: row['In which class/classes did you conduct the PBL project?'],
      subject_taught: row['Which subject do you teach?'],
      total_enrollment: Number(row['Derived: Total enrollment across Classes 6-8']),
      total_attendance: Number(row['Derived: Total attendance across PBL Science and Math sessions']),
      attendance_rate: Number(row['Derived: Overall PBL attendance rate']),
      risk_status: row['Derived: Risk status']
    });

    const mapGrantProfile = (row) => ({
      grant_id: row.grant_id,
      donor: row.donor,
      grant_name: row.grant_name,
      period_start: row.period_start,
      period_end: row.period_end,
      covered_districts: row.covered_districts,
      reporting_month: row.reporting_month,
      budget_line: row.budget_line,
      approved_budget_units: Number(row.approved_budget_units),
      monthly_utilized_units: Number(row.monthly_utilized_units),
      cumulative_utilized_units: Number(row.cumulative_utilized_units),
      cumulative_utilization_rate: Number(row.cumulative_utilization_rate),
      finance_note: row.finance_note
    });

    const mapGrantPerformance = (row) => ({
      ...row,
      sampled_school_records: Number(row.sampled_school_records),
      schools_completed_pbl: Number(row.schools_completed_pbl),
      pbl_completion_rate: Number(row.pbl_completion_rate),
      schools_with_evidence: Number(row.schools_with_evidence),
      evidence_submission_rate: Number(row.evidence_submission_rate),
      total_enrollment: Number(row.total_enrollment),
      total_attendance: Number(row.total_attendance),
      attendance_rate: Number(row.attendance_rate)
    });

    const mapEvidenceMedia = (row) => row; // direct map since column names match schema exactly

    // 4. parse files
    console.log('⏳ Parsing CSV files...');
    const julyData = await parseCSV('PBL_School_Response_Data_July_2025.csv', mapSchoolRow);
    const augustData = await parseCSV('PBL_School_Response_Data_August_2025.csv', mapSchoolRow);
    const septemberData = await parseCSV('PBL_School_Response_Data_September_2025.csv', mapSchoolRow);
    
    const profileData = await parseCSV('01_Grant_Profile_and_Finance.csv', mapGrantProfile);
    const performanceData = await parseCSV('02_Grant_Performance_and_Report_Material.csv', mapGrantPerformance);
    const mediaData = await parseCSV('03_Evidence_and_Media_Index.csv', mapEvidenceMedia);

    // combine monthly school data
    const allSchoolData = [...julyData, ...augustData, ...septemberData];

    // 5. insert into Mongodb
    console.log(' Inserting data into MongoDB Atlas...');
    if (allSchoolData.length) await SchoolResponse.insertMany(allSchoolData);
    if (profileData.length) await GrantProfile.insertMany(profileData);
    if (performanceData.length) await GrantPerformance.insertMany(performanceData);
    if (mediaData.length) await EvidenceMedia.insertMany(mediaData);

    console.log(` Success! Data seeded:`);
    console.log(`   - ${allSchoolData.length} School Responses`);
    console.log(`   - ${profileData.length} Grant Profile Rows`);
    console.log(`   - ${performanceData.length} Grant Performance Rows`);
    console.log(`   - ${mediaData.length} Evidence Media Items`);

    process.exit(0);
  } catch (error) {
    console.error(' Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();