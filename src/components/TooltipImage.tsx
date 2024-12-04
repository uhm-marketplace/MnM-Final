import { Image, OverlayTrigger, Tooltip } from 'react-bootstrap';

export type TooltipImageProps = {
  src: string;
  name: string;
  width: number;
  height: number;
  style?: React.CSSProperties;
  roundedCircle: boolean;
  className?: string | undefined;
};

const TooltipImage = ({
  src,
  name,
  width,
  height,
  style,
  roundedCircle,
  className,
}: TooltipImageProps) => (
  <OverlayTrigger overlay={<Tooltip id={`tooltip-${name}`}>{name}</Tooltip>}>
    <Image
      roundedCircle={roundedCircle}
      src={src}
      width={width}
      height={height}
      style={style}
      className={className}
      alt={name}
    />
  </OverlayTrigger>
);

TooltipImage.defaultProps = {
  style: {},
  className: undefined,
};

export default TooltipImage;
