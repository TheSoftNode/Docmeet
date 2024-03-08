import { faqs } from "./../../assets/data/faqs";
import FaqItem from "./FaqItem";



const FaqItem = () => {
  return (
    <ul>
        {faqs.map((item,index) => <FaqItem item={item} key={key} />)}
    </ul>

  )
}

export default FaqList