import React from 'react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import App from '../App';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';
import { questionsResponseApi } from '../tests/helpers/ourMocks/ourQuestions';
import userEvent from '@testing-library/user-event';


describe('Cobertura de testes da tela de Login', () => {
  afterEach(() => jest.restoreAllMocks());

    it('Teste se o botão de login está inicialmente desabilitado', () => {
        renderWithRouterAndRedux(<App />);

        const loginBtn = screen
          .getByRole('button', { name: /Play/i });
        expect(loginBtn).toBeInTheDocument();
        expect(loginBtn).toBeDisabled();
      });

    it('Teste se existe um campo para o email e o nome do jogador', () => {
        renderWithRouterAndRedux(<App />);

        const email = screen
          .getByPlaceholderText(/Type your email/i);
        const name = screen
          .getByPlaceholderText(/Type your name/i);
          
        expect(email).toBeInTheDocument();
        expect(name).toBeInTheDocument();
      });

    it('Teste se o botão fica habilitado após digitar no campos', () => {
        renderWithRouterAndRedux(<App />);

        const email = screen
          .getByPlaceholderText(/Type your email/i);
        const name = screen
          .getByPlaceholderText(/Type your name/i);
        const loginBtn = screen
          .getByRole('button', { name: /Play/i });

        expect(loginBtn).toBeInTheDocument();
        expect(loginBtn).toBeDisabled();
        userEvent.type(name, 'player1')
        userEvent.type(email, 'player1@player1.com')
        expect(loginBtn).not.toBeDisabled();
      });

      it('Teste se o botão de login redireciona para a página "Game"', async () => {
        const tokenAPI = {
          response_code: 0,
          response_message: "Token Generated Successfully!",
          token: "f00cb469ce38726ee00a7c6836761b0a4fb808181a125dcde6d50a9f3c9127b6"
      };

      jest.spyOn(global, 'fetch').mockResolvedValue({
        json: jest.fn().mockResolvedValueOnce(tokenAPI).mockResolvedValue(questionsResponseApi)
      });

        const { history } = renderWithRouterAndRedux(<App />);

        const email = screen
            .getByPlaceholderText(/Type your email/i);
        const name = screen
            .getByPlaceholderText(/Type your name/i);
        const loginBtn = screen
            .getByRole('button', { name: /Play/i });

        expect(loginBtn).toBeInTheDocument();
        expect(loginBtn).toBeDisabled();
        userEvent.type(name, 'player1')
        userEvent.type(email, 'player1@player1.com')
        expect(loginBtn).not.toBeDisabled();
        userEvent.click(loginBtn);

        const loadingElement = screen.getByText('Loading');
        expect(loadingElement).toBeInTheDocument();
        
        await waitForElementToBeRemoved(
          () => screen.getAllByText('Loading'),{ timeout: 3500 },
        );
        expect(loadingElement).not.toBeInTheDocument();
        
        expect(history.location.pathname).toBe('/game')

      });

      it('Teste se o botão de configurações existe e redireciona para as "Configurações"', () => {
        const { history } = renderWithRouterAndRedux(<App />);

        const configBtn = screen
          .getByRole('button', { name: /Configuration/i });

        expect(configBtn).toBeInTheDocument();
        userEvent.click(configBtn);

        const { pathname } = history.location;
        expect(pathname).toBe('/config');
      });

      it('Teste se é a feita requisição do token e se ele é salvo no localStorage', async () => {
        const tokenAPI = {
            response_code: 0,
            response_message: "Token Generated Successfully!",
            token: "f00cb469ce38726ee00a7c6836761b0a4fb808181a125dcde6d50a9f3c9127b6"
        };

        jest.spyOn(global, 'fetch').mockResolvedValue({
          json: jest.fn().mockResolvedValueOnce(tokenAPI).mockResolvedValue(questionsResponseApi)
        });

        renderWithRouterAndRedux(<App />);
        const email = screen
            .getByPlaceholderText(/Type your email/i);
        const name = screen
            .getByPlaceholderText(/Type your name/i);
        const loginBtn = screen
            .getByRole('button', { name: /Play/i });

        expect(loginBtn).toBeInTheDocument();
        expect(loginBtn).toBeDisabled();
        userEvent.type(name, 'player1')
        userEvent.type(email, 'player1@player1.com')
        expect(loginBtn).not.toBeDisabled();
        userEvent.click(loginBtn);

        expect(global.fetch).toBeCalledTimes(1);
        expect(global.fetch).toBeCalledWith('https://opentdb.com/api_token.php?command=request');
      });
});