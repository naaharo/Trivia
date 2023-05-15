import React from 'react';
import { screen  } from '@testing-library/react';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import userEvent from '@testing-library/user-event';
import { questionsResponseApi } from '../tests/helpers/ourMocks/ourQuestions';
import App from '../App';

const initialState = {
    player: {
      name:"Elaine",
      assertions:0,
      score:0,
      gravatarEmail:"elaine@hotmail.com",
    }
  }

describe('Cobertura de testes da tela de FeedBacks ', () => {
  afterEach(() => jest.restoreAllMocks());
  beforeEach(() => jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue(questionsResponseApi),
  }));

  it('Verifica se tem header em feedback com nome, imagem e pontuacao', () => {
    renderWithRouterAndRedux(<App />, initialState, '/feedback');
    const nameEl = screen.getByTestId('header-player-name');
    const scoreEl = screen.getByTestId('header-score');
    const imgEl = screen.getByTestId('header-profile-picture');


    expect(nameEl).toBeInTheDocument();
    expect(scoreEl).toBeInTheDocument();
    expect(imgEl).toBeInTheDocument();
  });

  it('Verifica se tem a pontuacao final, acertos e frase em feedback', () => {
    renderWithRouterAndRedux(<App />, initialState, '/feedback');
    const feedbackTextEl = screen.getByTestId('feedback-text');
    const totalScoreEl = screen.getByTestId('feedback-total-score');
    const totalQuestionEl = screen.getByTestId('feedback-total-question');

    expect(feedbackTextEl).toBeInTheDocument();
    expect(totalScoreEl).toBeInTheDocument();
    expect(totalQuestionEl).toBeInTheDocument();
  });

  it('Verifica se aparecem os botoes na tela e se estao habilitados', () => {
    renderWithRouterAndRedux(<App />, initialState, '/feedback');
    const buttonRankingTextEl = screen.getByTestId('btn-ranking');
    const buttonPlayAgainEl = screen.getByTestId('btn-play-again');

    expect(buttonRankingTextEl).toBeInTheDocument();
    expect(buttonPlayAgainEl).toBeInTheDocument();
    expect(buttonRankingTextEl).toBeEnabled();
    expect(buttonPlayAgainEl).toBeEnabled();
  });

  it('Verifica se ao clicar no botao PlayAgain, é redirecionado para o login', () => {
    const { history } = renderWithRouterAndRedux(<App />, initialState, '/feedback');

    const buttonPlayAgainEl = screen.getByTestId('btn-play-again');
    expect(buttonPlayAgainEl).toBeInTheDocument();

    userEvent.click(buttonPlayAgainEl)
    expect(history.location.pathname).toBe('/')
  });

  it('Verifica se clicar no botao Ranking, é redirecionado para o Ranking e se o botao voltar ao inicio', () => {
    const { history } = renderWithRouterAndRedux(<App />, initialState, '/feedback');
    const buttonRankingTextEl = screen.getByTestId('btn-ranking');
    expect(buttonRankingTextEl).toBeInTheDocument();

    userEvent.click(buttonRankingTextEl);

    expect(history.location.pathname).toBe('/ranking');

    const titleRanking = screen.getByTestId('ranking-title');
    expect(titleRanking).toBeInTheDocument();

    localStorage.setItem('ranking',
    JSON.stringify([{ name: "Elaine",
      "picture": "https://www.gravatar.com/avatar/6f80331c610f5c976275adfb76853979",
        "score": 70
    },
    { name: "Jose",
      picture: "https://www.gravatar.com/avatar/6f80331c610f5c976275adfb76853979",
      score: 90
    }, 
    { name: "Naiara",
      picture: "https://www.gravatar.com/avatar/6f80331c610f5c976275adfb76853979",
      score: 30
    }])
    );
    /* const localStoEl = localStorage.getItem('ranking')
    console.log(localStoEl[0]);
    localStoEl.map((tes,index) => console.log(tes,index)) */

    const playerRankingEl1 = screen.getByTestId(`player-name-0`)
    const playerRankingEl2 = screen.getByTestId(`player-name-1`)
    const playerRankingEl3 = screen.getByTestId(`player-name-2`)
    
    expect(playerRankingEl1).toBeInTheDocument()
    expect(playerRankingEl2).toBeInTheDocument()
    expect(playerRankingEl3).toBeInTheDocument()

    const buttonBacktoLoginEl =  screen.getByRole('button', { name: /back to start/i });
    expect(buttonBacktoLoginEl).toBeInTheDocument();
  });

  it('Ao clicar no botao voltar ao inicio, retorna para o login', () => {
    const { history } = renderWithRouterAndRedux(<App />, initialState, '/feedback');
    const buttonRankingTextEl = screen.getByTestId('btn-ranking');
    expect(buttonRankingTextEl).toBeInTheDocument();
    userEvent.click(buttonRankingTextEl);

     localStorage.setItem('ranking',
    [{ name: "Elaine",
      "picture": "https://www.gravatar.com/avatar/6f80331c610f5c976275adfb76853979",
        "score": 70
    }]) 
    const playerRankingEl2 = screen.getByTestId(`player-name-0`)
    expect(playerRankingEl2).toBeInTheDocument() 

    const buttonBacktoLoginEl =  screen.getByRole('button', { name: /back to start/i });
    expect(buttonBacktoLoginEl).toBeInTheDocument();

    userEvent.click(buttonBacktoLoginEl)
    expect(history.location.pathname).toBe('/')   
  });

});