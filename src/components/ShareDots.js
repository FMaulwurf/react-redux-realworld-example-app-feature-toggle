import React from 'react';
import moment from 'moment';
import { Group } from '@vx/group';
import { Circle } from '@vx/shape';
import { Grid } from '@vx/grid';
import { AxisBottom, AxisLeft } from '@vx/axis';
import { LinearGradient } from '@vx/gradient';
import { scaleLinear } from '@vx/scale';
import { withTooltip, Tooltip } from '@vx/tooltip';


let tooltipTimeout;

const sharetypeColors = {
  FACEBOOK: '#3b5998',
  TWITTER: '#0084b4',
  LINKEDIN: '#0077b5',
  WHATSAPP: '#25d366',
  EMAIL: '#CACCCE'
}

const xOffset = 55
const yOffset = 5

class ShareDots extends React.Component {

  render() {
    const { width = 1000, height = 500, shares = [] } = this.props;
    if(shares.length === 0) return null

    const xMax = width - xOffset + yOffset;
    const yMax = height - xOffset;
    const firstShare = moment(shares[0].createdAt)
    const latestShare = moment(shares[shares.length - 1].createdAt)
    
    const xStart = latestShare.dayOfYear() - 1
    const xEnd = firstShare.dayOfYear() + 1
    const gridTicksColumns = firstShare.diff(latestShare, 'days') + 2
    const xScale = scaleLinear({
      rangeRound: [0, xMax],
      domain: [xStart, xEnd],
    });
    const yScale = scaleLinear({
      rangeRound: [yMax, 0],
      domain: [0, 23],
    });

    return (
      <div>
        <svg width={width} height={height}>
          <LinearGradient from="#fafafa" to="#f5f5f5" id="green"/>;
          <rect width={width} height={height} rx={14} fill={"url(#green)"} />
          <Grid
            xScale={xScale}
            yScale={yScale}
            width={xMax + xOffset}
            height={yMax}
            numTicksRows={24}
            numTicksColumns={gridTicksColumns}
            xOffset={xOffset}
            yOffset={yOffset}
          />
          <AxisBottom
            label="Day of Year"
            numTicks={gridTicksColumns}
            scale={xScale}
            top={yMax + yOffset}
            left={xOffset}
          />
          <AxisLeft
            label="Hours"
            numTicks={24}
            scale={yScale}
            stroke={'#1b1a1e'}
            tickTextFill={'#1b1a1e'}
            left={xOffset}
            top={yOffset}
          />
          <Group
            onTouchStart={event => {
              if (tooltipTimeout) clearTimeout(tooltipTimeout);
              this.props.hideTooltip();
            }}
          >
            {shares.map((share, i) => {
              const { createdAt } = share
              const createdAtDate = moment(createdAt)
              const cx = xScale(createdAtDate.dayOfYear()) + xOffset;
              const cy = yScale(createdAtDate.hour()) + yOffset;
              const r = 10;
              const dotColor = sharetypeColors[share.sharetype] ? sharetypeColors[share.sharetype] : '#FFFFFF'
              return (
                <Circle
                  key={`share-${share.id}-${i}`}
                  className="dot"
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill={dotColor}
                  onMouseEnter={event => {
                    if (tooltipTimeout) clearTimeout(tooltipTimeout);
                    this.props.showTooltip({
                      tooltipLeft: cx,
                      tooltipTop: cy + 20,
                      tooltipData: share
                    });
                  }}
                  onMouseLeave={event => {
                    tooltipTimeout = setTimeout(() => {
                      this.props.hideTooltip();
                    }, 300);
                  }}
                  onTouchStart={event => {
                    if (tooltipTimeout) clearTimeout(tooltipTimeout);
                    this.props.showTooltip({
                      tooltipLeft: cx,
                      tooltipTop: cy - 30,
                      tooltipData: share
                    });
                  }}
                />
              );
            })}
          </Group>
        </svg>
        {this.props.tooltipOpen && (
          <Tooltip left={this.props.tooltipLeft} top={this.props.tooltipTop}>
            <div>
              <strong>Author:</strong> {this.props.tooltipData.author.username}
            </div>
            <div>
              <strong>Shared With:</strong> {this.props.tooltipData.sharetype}
            </div>
            <div>
              <strong>Shared At:</strong> {moment(this.props.tooltipData.createdAt).format("YYYY-MM-DD HH:mm:ss")}
            </div>
          </Tooltip>
        )}
      </div>
    );
  }
}

export default withTooltip(ShareDots);
