<?php namespace js\ace\controllers\main;

class Xhr extends \Controller
{
    public $allow = self::XHR;

    public function updateFolds()
    {
        $this->s('<:folds|', $this->data(), RR);
    }

    public function update()
    {
        $this->s('<|', $this->data(), RA);
    }
}
