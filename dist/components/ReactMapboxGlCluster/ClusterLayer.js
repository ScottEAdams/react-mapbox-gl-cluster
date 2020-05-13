import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import _createSuper from "@babel/runtime/helpers/esm/createSuper";
import React, { PureComponent } from "react";
import classnames from "classnames";
import { getCoord } from "@turf/invariant";
import { extractEventHandlers } from "../../common/utils";
import Cluster from "./Cluster";
import { MarkerLayer } from "../MarkerLayer";
import "./ClusterLayer.css";

var ClusterLayer = /*#__PURE__*/function (_PureComponent) {
  _inherits(ClusterLayer, _PureComponent);

  var _super = _createSuper(ClusterLayer);

  function ClusterLayer() {
    var _this;

    _classCallCheck(this, ClusterLayer);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _this._clusterMarkerFactory = function (coordinates, pointCount, getLeaves) {
      var clusterClassName = _this.props.clusterClassName;
      var className = classnames("cluster-layer--cluster", clusterClassName);
      var points = getLeaves();

      var pointsProps = _this._getPointsProps(points);

      var clusterEventHandlers = extractEventHandlers(_this.props, /^onCluster(.+)$/i);
      return /*#__PURE__*/React.createElement(MarkerLayer, Object.assign({
        key: coordinates.toString(),
        coordinates: coordinates,
        className: "cluster-layer-container",
        properties: pointsProps
      }, clusterEventHandlers), /*#__PURE__*/React.createElement("div", {
        className: className
      }, /*#__PURE__*/React.createElement("div", null, pointCount)));
    };

    return _this;
  }

  _createClass(ClusterLayer, [{
    key: "_getClusterProps",
    value: function _getClusterProps() {
      var _this$props = this.props,
          radius = _this$props.radius,
          minZoom = _this$props.minZoom,
          maxZoom = _this$props.maxZoom,
          extent = _this$props.extent,
          nodeSize = _this$props.nodeSize;
      return {
        radius,
        minZoom,
        maxZoom,
        extent,
        nodeSize
      };
    }
  }, {
    key: "_getPointsProps",
    value: function _getPointsProps(points) {
      return points.map(function (point) {
        var feature = point.props["data-feature"];
        var properties = feature.properties;
        return _objectSpread(_objectSpread({}, properties), {}, {
          coordinates: getCoord(feature)
        });
      });
    }
  }, {
    key: "_renderMarkers",
    value: function _renderMarkers() {
      var _this2 = this;

      var _this$props2 = this.props,
          data = _this$props2.data,
          pointClassName = _this$props2.pointClassName,
          _this$props2$pointSty = _this$props2.pointStyles,
          pointStyles = _this$props2$pointSty === void 0 ? {} : _this$props2$pointSty,
          MarkerComponent = _this$props2.markerComponent;
      var markerClassName = classnames("cluster-layer--point", pointClassName);
      return data.features.map(function (feature, key) {
        var coordinates = feature.geometry.coordinates,
            properties = feature.properties;
        var style = properties.style;
        var eventHandlers = extractEventHandlers(_this2.props);

        var cssObject = _objectSpread(_objectSpread({}, pointStyles), style);

        return /*#__PURE__*/React.createElement(MarkerLayer, Object.assign({
          key: "cluster-layer-point".concat(key),
          coordinates: coordinates,
          "data-feature": feature,
          properties: properties
        }, eventHandlers), MarkerComponent ? /*#__PURE__*/React.createElement(MarkerComponent, {
          properties: properties,
          className: markerClassName,
          style: cssObject
        }) : /*#__PURE__*/React.createElement("div", {
          className: markerClassName,
          style: cssObject
        }));
      });
    }
  }, {
    key: "render",
    value: function render() {
      var clusterProps = this._getClusterProps();

      return /*#__PURE__*/React.createElement(Cluster, Object.assign({
        ClusterMarkerFactory: this._clusterMarkerFactory
      }, clusterProps), this._renderMarkers());
    }
  }]);

  return ClusterLayer;
}(PureComponent);

ClusterLayer.displayName = "ClusterLayer";
ClusterLayer.defaultProps = {
  radius: 60,
  minZoom: 0,
  maxZoom: 20,
  extent: 512,
  nodeSize: 64
};
export default ClusterLayer;