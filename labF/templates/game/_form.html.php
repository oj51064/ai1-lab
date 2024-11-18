<?php
    /** @var $game ?\App\Model\Game */
?>

<div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="game[name]" value="<?= $game ? $game->getName() : '' ?>">
</div>

<div class="form-group">
    <label for="description">Description</label>
    <textarea id="description" name="game[description]"><?= $game? $game->getDescription() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
