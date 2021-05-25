// From https://primer.style/octicons
import React from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import * as MuiIcons from '@material-ui/icons'

export function AiiDAIcon200({
  width = 200,
  height = 200
}: {
  width: number
  height: number
}): JSX.Element {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* <!-- created using https://editor.method.ac --> */}
      <g>
        <title>background</title>
        <rect
          fill="none"
          id="canvas_background"
          height="402"
          width="582"
          y="-1"
          x="-1"
        />
      </g>
      <g>
        <title>Layer 1</title>
        <g id="svg_1" fill="#000000" transform="translate(0, 200) scale(0.1, -0.1)">
          <path
            fill="#84D3DB"
            id="svg_2"
            d="m1369.99536,994.72168c-75,-21.00024 -101,-34.00024 -161,-80.00024c-68,-51.99976 -135,-150.99976 -153,-222.99976l-6,-28l150,0l150,0l0,60c0,33 4,60 9,60c5,0 43,-20 85,-45c42,-24 106,-61 143,-81c81,-45.00006 143,-83.00006 143,-88.00006c0,-3 -24,-18 -52,-33c-71,-39 -116,-65 -225,-129c-51,-30 -94,-54 -97,-54c-3,0 -6,29 -6,65l0,65l-151,0c-166,0 -152,6 -133,-61c14,-50 82,-144.99988 135,-188.99988c87,-72 151,-94 279,-95c88,0 115,4 163,23c119,48 224,165.99988 261,290.99988c30,102 13,250.00006 -36,323.00006c-10,14 -18,31 -18,36c0,16 -127,129.99976 -168,150.99976c-49,24 -158,51.00024 -208,50.00024c-21,0 -68,-8 -104,-18z"
          />
        </g>
        <g
          id="svg_4"
          fill="#000000"
          transform="rotate(-120, 96.4437, 55.2508) translate(0, 200) scale(0.1, -0.1)"
        >
          <path
            fill="#FFB27C"
            id="svg_3"
            d="m849.99731,1866.47681c-75,-21 -101,-34 -161,-80c-68,-52 -135,-150.99988 -153,-222.99988l-6,-28l150,0l150,0l0,60c0,33 4,59.99988 9,59.99988c5,0 43,-19.99988 85,-44.99988c42,-24 105.99805,-61 142.99805,-81c81,-45 143,-83 143,-88c0,-3 -24,-18 -52,-33c-71,-39 -116,-65 -224.99805,-129c-51,-30 -94,-54 -97,-54c-3,0 -6,29 -6,65l0,65l-151,0c-166,0 -152,6 -133,-61c14,-50 82,-145 135,-189c87,-72 151,-93.99939 279,-94.99939c87.99805,0 114.99805,4 162.99805,22.99939c119,48 224,166 261,291c30,102 13,250 -36,322.99988c-10,14 -18,31 -18,36c0,16 -127,130 -168,151c-49,24 -158,51 -207.99805,50c-21,0 -68,-8 -104,-18z"
          />
        </g>
        <g
          id="svg_6"
          fill="#000000"
          transform="rotate(120, 50.1463, 142.426) translate(0, 200) scale(0.1, -0.1)"
        >
          <path
            fill="#A0D58A"
            id="svg_5"
            d="m387.00516,994.72168c-75,-21.00024 -101,-34.00024 -161,-80.00024c-68,-51.99976 -135,-150.99976 -153,-222.99976l-6,-28l150,0l150,0l0,60c0,33 4,60 9,60c5,0 43,-20 85,-45c42,-24 105.99997,-61 142.99997,-81c81,-45.00006 143,-83.00006 143,-88.00006c0,-3 -24,-18 -52,-33c-71,-39 -116,-65 -224.99997,-129c-51,-30 -94,-54 -97,-54c-3,0 -6,29 -6,65l0,65l-151,0c-166,0 -152,6 -133,-61c14,-50 82,-144.99988 135,-188.99988c87,-72 151,-94 279,-95c87.99997,0 114.99997,4 162.99997,23c119,48 224,165.99988 261,290.99988c30,102 13,250.00006 -36,323.00006c-10,14 -18,31 -18,36c0,16 -127,129.99976 -168,150.99976c-49,24 -158,51.00024 -207.99997,50.00024c-21,0 -68,-8 -104,-18z"
          />
        </g>
      </g>
    </svg>
  )
}

// TODO better value type, custom icons (https://primer.style/octicons/packages/react)
export const ElementIconMap: { [key: string]: JSX.Element } = {
  default: <MuiIcons.DeviceUnknown />,
  folder: <MuiIcons.Inbox />,
  'data.array': <MuiIcons.GridOn />,
  'data.bool': <MuiIcons.CheckCircle />,
  'data.cif': <MuiIcons.ScatterPlot />,
  'data.code': <MuiIcons.Code />,
  'data.dict': <MuiIcons.ViewList />,
  'data.float': <MuiIcons.AllInclusive />,
  'data.folder': <MuiIcons.Inbox />,
  'data.int': <MuiIcons.LooksOne />,
  'data.list': <MuiIcons.List />,
  'data.numeric': <MuiIcons.PlusOne />,
  'data.orbital': <MuiIcons.BlurOn />,
  'data.remote': <MuiIcons.OpenInNew />,
  'data.str': <MuiIcons.FormatColorText />,
  'data.structure': <MuiIcons.Grain />,
  'process.calculation': <RocketIcon />,
  'process.process': <RocketIcon />,
  'process.workflow': <GitBranchIcon /> // <MuiIcons.Share />,
}

export function RocketIcon(): JSX.Element {
  return (
    <SvgIcon>
      <path
        fillRule="evenodd"
        d="M20.322.75a10.75 10.75 0 00-7.373 2.926l-1.304 1.23A23.743 23.743 0 0010.103 6.5H5.066a1.75 1.75 0 00-1.5.85l-2.71 4.514a.75.75 0 00.49 1.12l4.571.963c.039.049.082.096.129.14L8.04 15.96l1.872 1.994c.044.047.091.09.14.129l.963 4.572a.75.75 0 001.12.488l4.514-2.709a1.75 1.75 0 00.85-1.5v-5.038a23.741 23.741 0 001.596-1.542l1.228-1.304a10.75 10.75 0 002.925-7.374V2.499A1.75 1.75 0 0021.498.75h-1.177zM16 15.112c-.333.248-.672.487-1.018.718l-3.393 2.262.678 3.223 3.612-2.167a.25.25 0 00.121-.214v-3.822zm-10.092-2.7L8.17 9.017c.23-.346.47-.685.717-1.017H5.066a.25.25 0 00-.214.121l-2.167 3.612 3.223.679zm8.07-7.644a9.25 9.25 0 016.344-2.518h1.177a.25.25 0 01.25.25v1.176a9.25 9.25 0 01-2.517 6.346l-1.228 1.303a22.248 22.248 0 01-3.854 3.257l-3.288 2.192-1.743-1.858a.764.764 0 00-.034-.034l-1.859-1.744 2.193-3.29a22.248 22.248 0 013.255-3.851l1.304-1.23zM17.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm-11 13c.9-.9.9-2.6 0-3.5-.9-.9-2.6-.9-3.5 0-1.209 1.209-1.445 3.901-1.49 4.743a.232.232 0 00.247.247c.842-.045 3.534-.281 4.743-1.49z"
      ></path>
    </SvgIcon>
  )
}

export function GitBranchIcon(): JSX.Element {
  return (
    <SvgIcon>
      <path
        fillRule="evenodd"
        d="M5.75 21a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM2.5 19.25a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zM5.75 6.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM2.5 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0zM18.25 6.5a1.75 1.75 0 110-3.5 1.75 1.75 0 010 3.5zM15 4.75a3.25 3.25 0 106.5 0 3.25 3.25 0 00-6.5 0z"
      ></path>
      <path
        fillRule="evenodd"
        d="M5.75 16.75A.75.75 0 006.5 16V8A.75.75 0 005 8v8c0 .414.336.75.75.75z"
      ></path>
      <path
        fillRule="evenodd"
        d="M17.5 8.75v-1H19v1a3.75 3.75 0 01-3.75 3.75h-7a1.75 1.75 0 00-1.75 1.75H5A3.25 3.25 0 018.25 11h7a2.25 2.25 0 002.25-2.25z"
      ></path>
    </SvgIcon>
  )
}

export function OptimadeIcon({
  width = 180,
  height = 180
}: {
  width?: number
  height?: number
}): JSX.Element {
  return (
    <SvgIcon>
      <svg
        version="1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 400"
        width={width}
        height={height}
      >
        <g
        // transform="matrix(3.5294118,0,0,3.5294118,-5.2941176,-5.2938861)"
        >
          <line
            y2="7.9474411"
            x2="38"
            y1="14.5"
            x1="27"
            style={{ stroke: '#9ed700', strokeWidth: 1.14999998 }}
          />
          <line
            y2="46.052559"
            x2="38"
            y1="33.25"
            x1="37.825317"
            style={{ stroke: '#00acd9', strokeWidth: 1.14999998 }}
          />
          <line
            y2="27"
            x2="5"
            y1="33.25"
            x1="16.174683"
            style={{ stroke: '#7a2dd0', strokeWidth: 1.14999998 }}
          />
          <line
            y2="46.052559"
            x2="38"
            y1="27"
            x1="49"
            style={{ stroke: '#00acd9', strokeWidth: 1.14999998 }}
          />
          <line
            y2="46.052559"
            x2="16"
            y1="46.052559"
            x1="38"
            style={{ stroke: '#e8e8e8', strokeWidth: 2 }}
          />
          <line
            y2="27"
            x2="5"
            y1="46.052559"
            x1="16"
            style={{ stroke: '#7a2dd0', strokeWidth: 1.14999998 }}
          />
          <line
            y2="7.9474411"
            x2="16"
            y1="27"
            x1="5"
            style={{ stroke: '#e8e8e8', strokeWidth: 2 }}
          />
          <line
            y2="7.9474411"
            x2="38"
            y1="7.9474411"
            x1="16"
            style={{ stroke: '#9ed700', strokeWidth: 1.14999998 }}
          />
          <line
            y2="27"
            x2="49"
            y1="7.9474411"
            x1="38"
            style={{ stroke: '#e8e8e8', strokeWidth: 2 }}
          />
          <circle r="3.5" cy="27" cx="49" style={{ fill: '#00acd9' }} />
          <circle r="3.5" cy="46.052559" cx="38" style={{ fill: '#00acd9' }} />
          <circle
            id="circle367"
            r="3.5"
            cy="46.052559"
            cx="16"
            style={{ fill: '#7a2dd0' }}
          />
          <circle r="3.5" cy="27" cx="5" style={{ fill: '#7a2dd0' }} />
          <circle r="3.5" cy="7.9474411" cx="16" style={{ fill: '#9ed700' }} />
          <circle r="3.5" cy="7.9474411" cx="38" style={{ fill: '#9ed700' }} />
          <line
            y2="33.25"
            x2="16.174683"
            y1="39.5"
            x1="27"
            style={{ stroke: '#ff414d', strokeWidth: 1 }}
          />
          <line
            y2="20.75"
            x2="16.174683"
            y1="33.25"
            x1="16.174683"
            style={{ stroke: '#ff414d', strokeWidth: 1 }}
          />
          <line
            y2="14.5"
            x2="27"
            y1="20.75"
            x1="16.174683"
            style={{ stroke: '#ff414d', strokeWidth: 1 }}
          />
          <line
            y2="20.75"
            x2="37.825317"
            y1="14.5"
            x1="27"
            style={{ stroke: '#ff414d', strokeWidth: 1 }}
          />
          <line
            y2="33.25"
            x2="37.825317"
            y1="20.75"
            x1="37.825317"
            style={{ stroke: '#ff414d', strokeWidth: 1 }}
          />
          <line
            y2="39.5"
            x2="27"
            y1="33.25"
            x1="37.825317"
            style={{ stroke: '#ff414d', strokeWidth: 1 }}
          />
          <circle r="2.5" cy="39.5" cx="27" style={{ fill: '#ff414d' }} />
          <circle r="2.5" cy="33.25" cx="16.174683" style={{ fill: '#ff414d' }} />
          <circle r="2.5" cy="20.75" cx="16.174683" style={{ fill: '#ff414d' }} />
          <circle r="2.5" cy="14.5" cx="27" style={{ fill: '#ff414d' }} />
          <circle r="2.5" cy="20.75" cx="37.825317" style={{ fill: '#ff414d' }} />
          <circle r="2.5" cy="33.25" cx="37.825317" style={{ fill: '#ff414d' }} />
        </g>
      </svg>
    </SvgIcon>
  )
}
