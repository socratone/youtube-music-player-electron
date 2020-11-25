const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

router.get('/', (req, res) => {
  let db = new sqlite3.Database('./db/database.sqlite3');

  let sql = `
    SELECT playlist.id, playlist.title, video.videoId, video.title videoTitle FROM playlist_video
    INNER JOIN playlist ON playlist.id = playlist_video.pId
    INNER JOIN video ON video.id = playlist_video.vId
    ORDER BY playlist.id`;
    // 재생리스트와 재생리스트에 들어 있는 곡 전부를 rows로 가져온다.

  new Promise((resolve, reject) => {
    db.all(sql, [], (error, rows) => {
      if (error) reject(error);
      resolve(rows);
    });
  }).then(rows => {
    console.log('rows1:', rows);
    let results = [];
    let lastId = 0;
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].id !== lastId) { // 새로운 id가 나왔을 때 객체를 새로 생성
        lastId = rows[i].id;
        let playlist = {
          listId: lastId,
          title: rows[i].title,
          videos: []
        };
        results.push(playlist);
      }
      const result = results[results.length - 1];
      result.videos.push({ 
        videoId: rows[i].videoId, 
        title: rows[i].videoTitle 
      });
    }
    return results;
  }).then(results => {
    let sql = `
      SELECT playlist.id, playlist.title FROM playlist
      LEFT OUTER JOIN playlist_video ON playlist.id = playlist_video.pId
      WHERE playlist_video.pId IS NULL`;
      // playlist_video.pId에 없는 playlist.id rows를 찾는다. (= 비어 있는 재생리스트)

    return new Promise((resolve, reject) => {
      db.all(sql, [], (error, rows) => {
        if (error) reject(error);
        resolve(rows);
      });
    }).then(rows => {
      console.log('rows2:', rows)
      db.close();
      rows.forEach(row => {
        results.push({
          listId: row.id,
          title: row.title,
          videos: [],
        });
      });
      return results;
    });
  }).then(results => {
    res.status(200).send(results);
  }).catch(error => {
    res.status(500).send(error);
  });
});

module.exports = router;