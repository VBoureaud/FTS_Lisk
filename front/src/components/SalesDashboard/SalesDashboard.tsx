import React from "react";
import Doughnut from '@/components/Doughnut';
import Line from '@/components/Line';
import Line2 from '@/components/Line2';
import Pie from '@/components/Pie';
import PolarArea from '@/components/PolarArea';
import Radar from '@/components/Radar';
import Scatter from '@/components/Scatter';
import Bar from '@/components/Bar';
import Bar2 from '@/components/Bar2';
import WorldMap from "@/components/WorldMap";

type Props = {
	loading: boolean;
}

import styles from "./salesdashboard.module.css";

export default function SalesDashboard(props: Props) {
	return (
		<div>
			{props.loading && <h3>Loading...</h3>}
			<div className={styles.mainContainer}>
				<div style={{ flex: 2 }} className={styles.container}>
					<Line />
				</div>
				<div style={{ flex: 1 }} className={styles.container}>
					<h3>Sales Analytic</h3>
					<div style={{ display: 'flex', height: '80%', justifyContent: 'center', flexDirection: 'column' }}>
						<h4>Today</h4>
						<div>
							<span className={styles.priceBig}>927€</span>
							<span className={styles.priceSmallDown}> ▼ 1.28%</span>
						</div>
						<span className={styles.separator}></span>
						<h4>Monthly</h4>
						<div>
							<span className={styles.priceBig}>10.927€</span>
							<span className={styles.priceSmallUp}> ▲ 14.58%</span>
						</div>
					</div>
				</div>
			</div>

			<div className={styles.mainContainer}>
				<div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
					<div style={{ flex: 1, height: 'fit-content' }} className={styles.container}>
						<h3>Sales Funnel</h3>
						<span className={styles.separator}></span>
						<div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', flexWrap: 'wrap' }}>
							<div>
								<h4>Total Market</h4>
								<div>
									<span className={styles.priceBig}>1.920.927€</span>
								</div>
							</div>
							<div>
								<h4>Prospect</h4>
								<div>
									<span className={styles.priceBig}>10.927€</span>
								</div>
							</div>
							<div>
								<h4>Leads</h4>
								<div>
									<span className={styles.priceBig}>230.927€</span>
								</div>
							</div>
							<div>
								<h4>Sales</h4>
								<div>
									<span className={styles.priceBig}>920.927€</span>
								</div>
							</div>
						</div>
					</div>
					<div style={{ flex: 1, height: 'fit-content' }} className={styles.container}>
						<h4>Quantities Sells</h4>
						<span className={styles.separator}></span>
						<span className={styles.separator}></span>
						<div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
							<div>
								<h4>Today</h4>
								<div>
									<span className={styles.priceBig}>178</span>
									<span className={styles.priceSmallDown}> ▼ 0.28%</span>
								</div>
							</div>
							<div>
								<h4>Monthly</h4>
								<div>
									<span className={styles.priceBig}>1780</span>
									<span className={styles.priceSmallUp}> ▲ 1%</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.container}>
					<h3>Revenues</h3>
					<Doughnut />
				</div>
			</div>

			<div className={styles.mainContainer}>
				<div style={{ flex: 1 }} className={styles.container}>
					<Line2 />
				</div>
			</div>
			<div className={styles.mainContainer}>
				<div style={{ flex: 1 }} className={styles.container}>
					<Bar2 />
				</div>
				<div style={{ flex: 1 }} className={styles.container}>
					<Bar />
				</div>
			</div>
			<div className={styles.mainContainer}>
				<div style={{ flex: 1 }} className={styles.container}>
					{/*WorldMap here !*/}
					<WorldMap
						markers={[
							{
								markerOffset: 15,
								name: 'test1',
								coordinates: [8.51693, 47.10169],
							},
							{
								markerOffset: 15,
								name: 'test3',
								coordinates: [-3.70256, 40.4165],
							},
							{
								markerOffset: 15,
								name: 'test4',
								coordinates: [10.31085, 45.52972],
							},
							{
								markerOffset: 15,
								name: 'test5',
								coordinates: [28.0625, 46.59278],
							},
							{
								markerOffset: 15,
								name: 'test6',
								coordinates: [10.74609, 59.91273],
							},
						]}
						lines={[
							{ start: [8.51693, 47.10169], end: [-3.70256, 40.4165] },
							{ start: [8.51693, 47.10169], end: [10.31085, 45.52972] },
							{ start: [8.51693, 47.10169], end: [28.0625, 46.59278] },
							{ start: [8.51693, 47.10169], end: [10.74609, 59.91273] },
						]}
						circleMarker
					//linesParents={parentsLineBuilder(stateNft.parents, [])}
					/>
				</div>
			</div>
		</div>
	);
};
