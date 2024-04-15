import React, { useEffect, useState } from 'react';
import {
  Stack,
  Card,
  CardContent,
  Container,
  Typography,
  Button,
  Grid,
  CardActions,
} from '@mui/material';
import axios from 'axios';

const App = () => {
  const [questionData, setQuestionData] = useState([]);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const letters = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    fetchQuestionData();
  }, []);

  useEffect(() => {
    if (questionData.length > 0) {
      setNewQuestion();
    }
  }, [questionData]);

  const fetchQuestionData = async () => {
    const response = await axios.get('https://restcountries.com/v3/all');
    const countries = response.data;
    setQuestionData(countries);
  };

  const setNewQuestion = () => {
    const randomCountry = questionData[Math.floor(Math.random() * questionData.length)];
    const correctCountry = randomCountry.name.common;

    const allCountries = questionData.map((country) => country.name.common);
    const shuffledCountries = shuffleArray(allCountries);
    const wrongCountries = shuffledCountries.slice(0, 3);
    const finalOptions = [correctCountry, ...wrongCountries];
    shuffleArray(finalOptions);

    setQuestion(randomCountry);
    setOptions(finalOptions);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const handleOptionClick = (selectedOption) => {
    setSelectedOption(selectedOption);

    const correctCountry = question.name.common;
    setIsCorrect(selectedOption === correctCountry);

    if (selectedOption === correctCountry) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextClick = () => {
    if (isCorrect === false) {
      setQuizFinished(true); // Show results screen if the selected option is incorrect
    } else {
      setSelectedOption(null);
      setIsCorrect(null);
      setNewQuestion();
    }
  };

  const handleTryAgainClick = () => {
    setScore(0);
    setSelectedOption(null);
    setQuizFinished(false);
    setNewQuestion();
    

  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        height: '100vh',
        backgroundImage: "url('./background.png')",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack>
        <Typography
          variant="h4"
          gutterBottom
          justifyContent="left"
          sx={{ color: 'white', display: 'flex', alignItems: 'center' }}
        >
          Country Quiz
        </Typography>
        {!quizFinished && (
          <Card
            sx={{
              width: '370px',
              height: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: 'white',
            }}
          >
              <CardContent sx={{ alignItems: 'center' }}>
                {question && (
                  <>
                    <Typography variant="body1" gutterBottom>
                      {question.capital} is the capital of?
                    </Typography>
                    <Grid container spacing={2}>
                      {options.map((country, index) => (
                        <Grid item key={index} xs={12}>
                          <Button
                            fullWidth
                            variant="outlined"
                            className={selectedOption === country ? 'selected' : ''}
                            sx={{
                              backgroundColor:
                                selectedOption === country
                                  ? isCorrect
                                    ? 'aquamarine'
                                    : 'red'
                                  : 'white',
                              color: selectedOption === country ? 'white' : 'black',
                              justifyContent: 'flex-start',
                              borderColor: 'black',
                              '&:hover': {
                                backgroundColor: 'orange',
                              },
                            }}
                            onClick={() => handleOptionClick(country)}
                            disabled={isCorrect !== null}
                          >
                            <span style={{ marginRight: '10px' }}>{letters[index]}</span>
                            {country}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                    {selectedOption !== null && (
                      <CardActions
                        sx={{
                          justifyContent: 'flex-end',
                          marginBottom: '30px',
                          marginRight: '16px',
                        }}
                      >
                        {isCorrect ? (
                        <Button
                          onClick={handleNextClick}
                          variant="contained"
                          sx={{ color: 'black', backgroundColor: 'orange' }}
                        >
                          Next
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setQuizFinished(true)}
                          variant="contained"
                          sx={{ color: 'black', backgroundColor: 'orange' }}
                        >
                          Next
                        </Button>
                      )}
                    </CardActions>
                  )}
                  
                  </>
                )}
              </CardContent>
          </Card>
        )}
        {quizFinished && (
          <Card
            sx={{
            width: '370px',
            height: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: 'white',
          }}>
            <CardContent sx={{ alignItems: 'center' }}>
              <Typography variant="h4" gutterBottom sx={{ alignItems: 'center' }}>
                Results
              </Typography>
              <Typography variant="h6" gutterBottom>
                Your Score: {score}
              </Typography>
              <Button
                onClick={handleTryAgainClick}
                variant="contained"
                sx={{ color: 'black', backgroundColor: 'orange' }}
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Container>
  );
};

export default App;
