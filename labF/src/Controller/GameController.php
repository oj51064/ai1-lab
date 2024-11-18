<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Game;
use App\Service\Router;
use App\Service\Templating;

class GameController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $games = Game::findAll();
        $html = $templating->render('game/index.html.php', [
            'games' => $games,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestGame, Templating $templating, Router $router): ?string
    {
        if ($requestGame) {
            $game = Game::fromArray($requestGame);
            // @todo missing validation
            $game->save();

            $path = $router->generatePath('game-index');
            $router->redirect($path);
            return null;
        } else {
            $game = new Game();
        }

        $html = $templating->render('game/create.html.php', [
            'game' => $game,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $gameId, ?array $requestGame, Templating $templating, Router $router): ?string
    {
        $game = Game::find($gameId);
        if (!$game) {
            throw new NotFoundException("Missing game with id $gameId");
        }

        if ($requestGame) {
            $game->fill($requestGame);
            // @todo missing validation
            $game->save();

            $path = $router->generatePath('game-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('game/edit.html.php', [
            'game' => $game,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $gameId, Templating $templating, Router $router): ?string
    {
        $game = Game::find($gameId);
        if (! $game) {
            throw new NotFoundException("Missing game with id $gameId");
        }

        $html = $templating->render('game/show.html.php', [
            'game' => $game,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $gameId, Router $router): ?string
    {
        $game = Game::find($gameId);
        if (! $game) {
            throw new NotFoundException("Missing game with id $gameId");
        }

        $game->delete();
        $path = $router->generatePath('game-index');
        $router->redirect($path);
        return null;
    }
}
