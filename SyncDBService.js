import {
  createLastUpdateTable,
  createMessagesHistoryTable,
  createVariablesTable,
  getDBConnection,
  getDBReadOnlyConnection,
  updateDataSet,
  updateMinutDataset,
} from './utils/llmChain';

module.exports = async taskData => {
  console.log('background task running ', taskData);
  const db = await getDBConnection();
  const dbRead = await getDBReadOnlyConnection();
  if (db) {
    if (dbRead) {
      try {
        await createMessagesHistoryTable(db);
        await createVariablesTable(db);
        await createLastUpdateTable(db);
        let var_dataset = await dbRead.executeSql('SELECT * FROM variables_76');
        console.log("variable table length", var_dataset[0].rows.length);
        await updateMinutDataset(var_dataset[0], db, dbRead);
      } catch (error) {
        console.log('cant open db', error);
        // throw error;
      } finally {
        console.log('db operation completed');
      }
    }
  }
  // taskFinished(taskData);
};
