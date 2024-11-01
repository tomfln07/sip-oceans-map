import { useEffect, useRef } from "react"
import "./style.css"

export function Item({ x, y, coords_ref }) {
	const item_ref = useRef(null);

	useEffect(() => {
		const id = setInterval(() => {
			console.log(`${coords_ref.current[1] + y}`);
			if (item_ref) {
				item_ref.current.style.top = `${-coords_ref.current[1] + y}px`;
				item_ref.current.style.left = `${-coords_ref.current[0] + x}px`;
			}
		}, 50);

		return () => {
			clearInterval(id);
		}
	}, []);

	return (
		<div className="item" ref={item_ref} style={{ zIndex: "3" }}>
			<h1>ITEM</h1>
		</div>
	)
}