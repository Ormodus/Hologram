
const neo4j = require('neo4j-driver');

export const driver = neo4j.driver(
    'bolt://localhost:7687',
    neo4j.auth.basic('username', 'password')
);

export const session = driver.session();

// const query = 'MATCH (n:Person) RETURN n.name as name';
// session
//   .run(query)
//   .then((result) => {
//     result.records.forEach((record) => {
//       console.log(record.get('name'));
//     });
//     session.close();
//     driver.close();
//   })
//   .catch((error) => {
//     console.error('Error running Cypher query:', error);
//     session.close();
//     driver.close();
//   });

  