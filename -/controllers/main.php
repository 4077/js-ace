<?php namespace js\ace\controllers;

class Main extends \Controller
{
    public function view()
    {
        $instance = $this->_instance(k(8));

        $v = $this->v('|');
        $s = $this->s('|', [
            'cursor'      => [
                'row'    => 0,
                'column' => 0
            ],
            'folds'       => [],
            'scroll_top'  => 0,
            'scroll_left' => 0,
            'selection'   => [
                'start' => [
                    'row'    => 0,
                    'column' => 0
                ],
                'end'   => [
                    'row'    => 0,
                    'column' => 0
                ]
            ],
        ]);

        $containerId = md5($instance);

        $v->assign([
                       'CONTAINER_ID' => $containerId,
                       'CLASS'        => $this->data('class')
                   ]);

        $this->widget('dispatcher:body');

        $this->js('ace');

        $this->widget(':|', [
            'containerId' => $containerId,
            'basePath'    => abs_url('-/ace/js'),
            'mode'        => $this->data('mode') ?? 'text',
            'code'        => $this->data('code'),
            'readonly'    => $this->data('readonly'),
            'folds'       => $s['folds'],
            'cursor'      => $s['cursor'],
            'scrollTop'   => $s['scroll_top'],
            'scrollLeft'  => $s['scroll_left'],
            'selection'   => $s['selection'],
            '.r'          => [
                'updateValue' => $this->_caller()->_abs($this->data('path'), $this->data('data')),
                'update'      => $this->_abs('>xhr:update|'),
                'updateFolds' => $this->_abs('>xhr:updateFolds|')
            ],
        ]);

        $this->css();

        return $v;
    }

    public function resizeAll()
    {
        $this->widget('dispatcher:body');
        $this->widget('dispatcher:body', 'resizeAll');
    }
}
