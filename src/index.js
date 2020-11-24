const express = require('express');
const app = express();

const playlist = require('./playlistTitle');
 
app.use('/api/playlist/title', playlist);

app.listen(4000, () => console.log('서버가 4000 포트에서 가동 중입니다.'));