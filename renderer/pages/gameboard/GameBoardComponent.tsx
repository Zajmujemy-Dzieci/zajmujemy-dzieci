import { GameBoardConfiguration } from ".";

export function GameBoardComponent({
  numberOfQuestionFields = 15,
  numberOfGoodSpecialFields = 3,
  numberOfBadSpecialFields = 3,
}: GameBoardConfiguration) {
  const numberOfColumns = Math.floor(numberOfQuestionFields / 3) - 1;
  return (
    <div className="w-full h-full grid grid-cols-9 grid-rows-7 gap-4">
      <div className="bg-childBlack">1</div>
      <div className="col-start-1 row-start-2 bg-childWhite">2</div>
      <div className="col-start-1 row-start-3 bg-secondary">3</div>
      <div className="col-start-1 row-start-4 bg-childWhite">4</div>
      <div className="col-start-1 row-start-5 bg-secondary">5</div>
      <div className="col-start-1 row-start-6 bg-childWhite">6</div>
      <div className="col-start-2 row-start-6 bg-secondary">7</div>
      <div className="col-start-3 row-start-6 bg-childWhite">8</div>
      <div className="col-start-3 row-start-5 bg-secondary">9</div>
      <div className="col-start-3 row-start-4 bg-childWhite">10</div>
      <div className="col-start-3 row-start-3 bg-secondary">11</div>
      <div className="col-start-3 row-start-2 bg-childWhite">12</div>
      <div className="col-start-4 row-start-2 bg-secondary">13</div>
      <div className="col-start-5 row-start-2 bg-childWhite">14</div>
      <div className="col-start-5 row-start-3 bg-secondary">15</div>
      <div className="col-start-5 row-start-4 bg-childWhite">16</div>
      <div className="col-start-5 row-start-5 bg-secondary">17</div>
      <div className="col-start-5 row-start-6 bg-childWhite">18</div>
      <div className="col-start-6 row-start-6 bg-secondary">19</div>
      <div className="col-start-7 row-start-6 bg-childWhite">20</div>
      <div className="col-start-7 row-start-5 bg-secondary">21</div>
      <div className="col-start-7 row-start-4 bg-childWhite">22</div>
      <div className="col-start-7 row-start-3 bg-secondary">23</div>
      <div className="col-start-7 row-start-2 bg-childWhite">24</div>
      <div className="col-start-8 row-start-2 bg-secondary">25</div>
      <div className="col-start-9 row-start-2 bg-childWhite">26</div>
      <div className="col-start-9 row-start-3 bg-secondary">27</div>
      <div className="col-start-9 row-start-4 bg-childWhite">28</div>
      <div className="col-start-9 row-start-5 bg-secondary">29</div>
      <div className="col-start-9 row-start-6 bg-childWhite">30</div>
      <div className="col-start-9 row-start-7 bg-childBlack">31</div>
    </div>
  );
}
