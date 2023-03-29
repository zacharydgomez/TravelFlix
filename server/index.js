/* eslint-disable no-return-assign */
const path = require('path');
const express = require('express');
const { getTop100By, youtubeSearch } = require('./Api/api');
require('dotenv').config();

const { initDb } = require('./database');

const app = express();
const CLIENT_PATH = path.resolve(__dirname, '../client/dist');
app.use(express.static(CLIENT_PATH));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const PORT = 8086;

// Receives request for unique netflix programs
// makes call to api for each country, returns data to
// server which then uses ServerFunc to manipulate and then returns manipulated data back to client
app.get('/findUnique', async (req, res) => {
  const { origin, destination } = req.query;
  let originArr;
  let destinationArr;

  await getTop100By(origin)
    .then((data) => originArr = data.results)
    .catch((error) => console.error(error));

  await getTop100By(destination)
    .then((data) => destinationArr = data.results)
    .catch((error) => console.error(error));

  // this code takes the destination array and the origin array and returns
  // a newArray of unique items
  const uniqueArray1 = destinationArr
  // eslint-disable-next-line max-len
    .filter((country1) => !originArr.some((country2) => country1.netflix_id === country2.netflix_id));

  res.send(uniqueArray1);
});

app.post('/search', (req, res) => {
  console.log(req.body);
  youtubeSearch(req.body.title).then((data) => {
    const videoIds = data.items.map((item) => item.id.videoId);
    console.log(videoIds);
    res.send(videoIds[0]);
  });
});
// needed to add this because without it was trying to create
// a new instance without having defined the model
(async () => {
  // Initialize the database and get the User model
  const { User, Movie } = await initDb();
  // Gets users for activity feed
  app.get('/users', async (req, res) => {
    await User.findAll({ limit: 20 })
      .then((data) => res.send(data))
      .catch((error) => {
        console.error('Error in UserObject');
        res.send(error);
      });
  });
  // for testing
  // app.post('/Users', async (req, res) => {
  //   const {
  //     userName,
  //     comments,
  //     locationsTraveled,
  //     movieList,
  //     homeCountry,
  //   } = req.body;
  //   await User.create({
  //     userName,
  //     comments,
  //     locationsTraveled,
  //     movieList,
  //     homeCountry,
  //   })
  //     .then((data) => res.send(data))
  //     .catch((error) => res.send(error));
  // });

  // Use the User model in your app.post('/User') route
  app.post('/User', async (req, res) => {
    const { userName } = req.body;
    await User.create({ userName })
      .then((data) => console.log(data));
  });

  // get all the movies from the movie model
  app.get('/findMovies', async (req, res) => {
    const { title } = req.query.selectedMovie;
    await Movie.findOne({ where: { movieName: title } }).then((data) => {
      if (data) {
        res.send(data).status(200);
      } else {
        res.send(data).status(200);
      }
    })
      .catch((err) => {
        console.log('ERROR was unable to get all movies: ', err);
      });
  });
  // create movie
  app.post('/Movie', async (req, res) => {
    const { movieName, thumbsUp, thumbsDown } = req.body;

    await Movie.create({ movieName, thumbsUp, thumbsDown }).then((data) => res.send(data));
  });

  app.put('/Movie/UpdateThumbs/', (req, res) => {
    const { movieName, thumbsUp, thumbsDown } = req.body;

    // console.log(movieName, thumbsUp, thumbsDown);

    Movie.update({
      thumbsUp,
      thumbsDown,
    }, {
      where: {
        movieName,
      },
      returning: true,
    })
      .then((data) => {
        console.log(data);
        if (data) {
          console.log('updated');
          res.sendStatus(200);
        } else {
          console.log('error: ', data);
          res.sendStatus(404);
        }
      })
      .catch((err) => {
        console.error('error data is undefine', err);
        res.sendStatus(500);
      });
  });
})();

app.listen(PORT, () => {
  console.log(`Server listening on :${PORT}`);
});
