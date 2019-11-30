import {menuTpl} from "./components/menu";
import {filterMainTpl} from "./components/filter";
import {contentTpl} from "./components/content";
import {filterBoardTpl} from "./components/filter-board";
import {addCardFormTpl} from "./components/card-edit";
import {cardTpl} from "./components/card";
import {buttonLoadMoreTpl} from "./components/button-more";

const TASK_COUNT = 3;

function render(selector, template, placing) {
  document.querySelector(selector).insertAdjacentHTML(placing, template);
}

render(`.main__control`, menuTpl(), `beforeend`);
render(`.main`, filterMainTpl(), `beforeend`);
render(`.main`, contentTpl(), `beforeend`);
render(`.board.container`, filterBoardTpl(), `afterbegin`);
render(`.board__tasks`, addCardFormTpl(), `beforeend`);

new Array(TASK_COUNT)
  .fill(``)
  .map(() => {
    return render(`.board__tasks`, cardTpl(), `beforeend`);
  })
  .join(``);

render(`.board`, buttonLoadMoreTpl(), `beforeend`);
