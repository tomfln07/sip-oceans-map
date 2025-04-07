import "./style.css"
import { Fragment } from "react";

export function Popup({ pt_data, unshow_popup }) {

	return (
		<>
			<div className="blurred-bg" onClick={() => unshow_popup(true)}></div>
			<div className="popup-box rubik-300">
				<div className="popup-box-top">	
					<span className="material-symbols-outlined close" onClick={() => unshow_popup(true)}>close</span>
					<h1 className="popup-label">{pt_data.label}</h1>
				</div>
				{ pt_data.content.map((content, i) => (
					<div style={{ marginTop: "30px" }} id={i}>
						<h3 className="content_title">{content.title}</h3>
						<p className="popup-text">
							{content.desc.split('\n').map((line, j) => (
								<Fragment key={j}>{line}<br /></Fragment>
							))}
						</p>
						{ content.src ? (
							content.src.map((src, i) => (
								<p className="popup-infos-sources">src - <a href={src.href} target="_blank">{src.name}</a></p>
							))
						) : null }
					</div>
				)) }
				{
					pt_data.images.map((file_name, i) => {
						const img = new URL(`../../assets/${file_name}`, import.meta.url).href;
						return <img key={i} src={img} alt={`popup-img-${i}`} />;
					})
				}
			</div>
		</>
	)
}