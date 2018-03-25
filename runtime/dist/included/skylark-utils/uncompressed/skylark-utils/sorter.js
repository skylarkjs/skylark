define([
    "./skylark",
    "./langx",
    "./noder",
    "./datax",
    "./geom",
    "./eventer",
    "./mover",
    "./resizer",
    "./styler",
    "./query"
],function(skylark, langx,noder,datax,geom,eventer,mover,resizer,styler,$){
    var on = eventer.on,
        off = eventer.off,
        attr = datax.attr,
        removeAttr = datax.removeAttr,
        offset = geom.pagePosition,
        addClass = styler.addClass,
        height = geom.height,
        some = Array.prototype.some,
        map = Array.prototype.map;




    function sorter(){
      return sorter;
    }

    langx.mixin(sorter, {

        select : select,

        unselect : unselect

    });

    return skylark.sorter = sorter;
});
