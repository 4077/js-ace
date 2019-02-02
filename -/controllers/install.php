<?php namespace js\ace\controllers;

class Install extends \Controller
{
    public function run()
    {
        $dir = $this->_module()->dir;

        $copyList = [
            '/-/install/ace' => '-/ace/js'
        ];

        foreach ($copyList as $source => $target) {
            copy_dir(abs_path($dir, $source), public_path($target));
        }
    }
}
