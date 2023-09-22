import * as dotenv from 'dotenv';
import { google } from 'googleapis';

// .env config
dotenv.config({ path: '.env.local' });
const SPREADSHEET_ID = process.env.DIRECTORY_SPREADSHEET_ID;
const SERVICE_ACCOUNT = process.env.SERVICE_ACCOUNT ?? '{}';

export default async function getOfficerData(
  committeeName: string,
): Promise<object[]> {
  const sheets = google.sheets({ version: 'v4' });
  // Get JWT Token to access sheet
  const service_account = JSON.parse(SERVICE_ACCOUNT);
  const jwtClient = new google.auth.JWT(
    service_account.client_email,
    '',
    service_account.private_key,
    ['https://www.googleapis.com/auth/spreadsheets'],
  );
  jwtClient.authorize(function (err) {
    if (err) {
      throw err;
    }
  });
  // Get officer data from google spreadsheets
  const res = await sheets.spreadsheets.values.get({
    auth: jwtClient,
    spreadsheetId: SPREADSHEET_ID,
    range: 'Officers',
  });
  const rows = res?.data.values;
  if (!rows || rows.length == 0) {
    throw new Error('Error: no data found');
  }
  // Map committee names in the spreadsheet to more concise names
  // Ignore board as it's not a committee
  const committees = new Map<string, string>([
    ['Board, Internal', 'board'],
    ['Board, External', 'board'],
    ['AI', 'ai'],
    ['Cyber', 'cyber'],
    ['Design', 'design'],
    ['Studio', 'studio'],
    ['Hack', 'hack'],
    ['ICPC', 'icpc'],
    ['Teach LA', 'teachla'],
    ['W', 'w'],
  ]);
  // // Store officer data
  const officers: object[] = []; // list of officers in desired committee
  let currCommittee = '';
  let officerID = 1;
  rows.forEach((row) => {
    if (row.length == 0)
      // empty row
      return;
    if (committees.has(row[0])) {
      // row with only committee name
      const committee = row[0];
      currCommittee = committees.get(committee) ?? '';
      return;
    }
    if (currCommittee != committeeName)
      // skip all rows other than desired committee
      return;
    // push row data into officers list
    let image = row[10];
    if (!image) {
      image = '/profile.png';
    } else if (image.includes('drive.google.com')) {
      const fileID = image.match(/\/file\/d\/(.+?)\//)[1];
      image = `https://drive.google.com/uc?export=download&id=${fileID}`;
    }
    // create officer
    const officer = {
      id: officerID,
      position: row[0] ?? null,
      name: row[1] ?? null,
      pronouns: row[2] ?? null,
      email: row[3] ?? null,
      github: row[9] ?? null,
      imageURL: image ?? null,
    };
    officers.push(officer);
    officerID++;
  });

  return officers;
}
