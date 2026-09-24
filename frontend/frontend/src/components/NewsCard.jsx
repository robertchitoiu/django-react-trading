import '../styles/NewsCard.css'

function NewsCard(props) {
   const date = new Date(props.datetime * 1000).toDateString()

   return (
      <div className="news-card">
         <img src={props.image} alt='news card image' className="card-image"></img>
         <div className="news-details">
            <div className="news-header">
               <p className="news-category">{props.category}</p>
               <p className="news-date">{date}</p>
            </div>
            <br></br>
            <h2 className="news-title">{props.headline}</h2>
            <p className="news-summary">{props.summary}</p>
            <p className="news-source">{props.source}</p>
            <a href={props.url} target="_blank"><button>Read More</button></a>
         </div>
      </div>
   )
}

export default NewsCard