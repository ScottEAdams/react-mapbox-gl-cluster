import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { getCoord } from "@turf/invariant";
import { extractEventHandlers } from "../../common/utils";
import Cluster from "./Cluster";
import { MarkerLayer } from "../MarkerLayer";
import "./ClusterLayer.css";

class ClusterLayer extends PureComponent {
	_clusterMarkerFactory = (coordinates, pointCount, getLeaves) => {
		const { clusterClassName } = this.props;
		const className = classnames("cluster-layer--cluster", clusterClassName);
		const points = getLeaves();
		const pointsProps = this._getPointsProps(points);
		const clusterEventHandlers = extractEventHandlers(this.props, /^onCluster(.+)$/i);

		return (
			<MarkerLayer
				key={coordinates.toString()}
				coordinates={coordinates}
				className="cluster-layer-container"
				properties={pointsProps}
				{...clusterEventHandlers}
			>
				<div className={className}>
					<div>{pointCount}</div>
				</div>
			</MarkerLayer>
		);
	};

	_getClusterProps() {
		const { radius, minZoom, maxZoom, extent, nodeSize } = this.props;

		return {
			radius,
			minZoom,
			maxZoom,
			extent,
			nodeSize
		};
	}

	_getPointsProps(points) {
		return points.map(point => {
			const feature = point.props["data-feature"];
			const { properties } = feature;
			return {
				...properties,
				coordinates: getCoord(feature)
			};
		});
	}

	_renderMarkers() {
		const { data, pointClassName, pointStyles = {}, markerComponent: MarkerComponent } = this.props;
		const markerClassName = classnames("cluster-layer--point", pointClassName);

		return data.features.map((feature, key) => {
			const {
				geometry: { coordinates },
				properties
			} = feature;
			const { style } = properties;
			const eventHandlers = extractEventHandlers(this.props);
			const cssObject = {
				...pointStyles,
				...style
			};

			return (
				<MarkerLayer
					key={`cluster-layer-point${key}`}
					coordinates={coordinates}
					data-feature={feature}
					properties={properties}
					{...eventHandlers}
				>
					{MarkerComponent ? (
						<MarkerComponent properties={properties} className={markerClassName} style={cssObject} />
					) : (
						<div className={markerClassName} style={cssObject} />
					)}
				</MarkerLayer>
			);
		});
	}

	render() {
		const clusterProps = this._getClusterProps();

		return (
			<Cluster ClusterMarkerFactory={this._clusterMarkerFactory} {...clusterProps}>
				{this._renderMarkers()}
			</Cluster>
		);
	}
}

ClusterLayer.displayName = "ClusterLayer";

ClusterLayer.propTypes = {
	/**
	 * Data source for layer. It must to follow FeatureCollection geojson format
	 */
	data: PropTypes.shape({
		type: PropTypes.oneOf(["FeatureCollection"]).isRequired,
		features: PropTypes.arrayOf(
			PropTypes.shape({
				type: PropTypes.oneOf(["Feature"]).isRequired,
				geometry: PropTypes.shape({
					type: PropTypes.string.isRequired,
					coordinates: PropTypes.array.isRequired
				}).isRequired,
				properties: PropTypes.object.isRequired
			})
		).isRequired
	}),

	/**
	 * [Optional] Cluster radius, in pixels.
	 */
	radius: PropTypes.number,

	/**
	 * [Optional] Minimum zoom level at which clusters are generated.
	 */
	minZoom: PropTypes.number,

	/**
	 * [Optional] Maximum zoom level at which clusters are generated.
	 */
	maxZoom: PropTypes.number,

	/**
	 * [Optional] (Tiles) Tile extent. Radius is calculated relative to this value.
	 */
	extent: PropTypes.number,

	/**
	 * [Optional] Size of the KD-tree leaf node. Affects performance.
	 */
	nodeSize: PropTypes.number,

	/**
	 * [Optional] The class name of each point.
	 */
	pointClassName: PropTypes.string,

	/**
	 * [Optional] The styles name of each point.
	 */
	pointStyles: PropTypes.object,

	/**
	 * [Optional] The class name of each cluster.
	 */
	clusterClassName: PropTypes.string,

	/**
	 * [Optional] Customize the marker
	 */
	markerComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),

	/**
	 * [Optional] Handle when user move the mouse leave a point
	 */
	onMouseLeave: PropTypes.func,

	/**
	 * [Optional] Handler for when user on marker
	 **/
	onClick: PropTypes.func,

	/**
	 * [Optional] Handle when user click on cluster
	 */
	onClusterClick: PropTypes.func,

	/**
	 * [Optional] Handle when user move the mouse enter a cluster
	 */
	onClusterMouseEnter: PropTypes.func,

	/**
	 * [Optional] Handle when user move the mouse leave a cluster
	 */
	onClusterMouseLeave: PropTypes.func
};

ClusterLayer.defaultProps = {
	radius: 60,
	minZoom: 0,
	maxZoom: 20,
	extent: 512,
	nodeSize: 64
};

export default ClusterLayer;
