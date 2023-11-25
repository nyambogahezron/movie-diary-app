import SingleQuestion from './SingleQuestion';
import {FaQuestion} from 'react-icons/fa6'

const Questions = ({ questions, activeId, toggleQuestion }) => {
  return (
    <section className='container'>
     <div className='q-header'>
      <h1>Questions</h1>
      <div className='question-icon'><FaQuestion /></div>
      <div className='ask-btn'>Ask</div>
      </div>
      {questions.map((question) => {
        return (
          <SingleQuestion
            key={question.id}
            {...question}
            activeId={activeId}
            toggleQuestion={toggleQuestion}
          ></SingleQuestion>
        );
      })}
    </section>
  );
};
export default Questions;
