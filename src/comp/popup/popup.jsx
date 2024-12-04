import "./style.css"

export function Popup({ pt_data, unshow_popup }) {

	return (
		<>
			<div className="blurred-bg" onClick={() => unshow_popup(true)}></div>
			<div className="popup-box rubik-300">
				<div className="popup-box-top">	
					<span className="material-symbols-outlined close" onClick={() => unshow_popup(true)}>close</span>
					<h1 className="popup-label">{pt_data.label}</h1>
				</div>
				<p className="popup-text">{pt_data.content}</p>
			</div>
		</>
	)
}