// This is a copy of the stock Idyll scroller with minor changes:
// Added an offset param to control when scrollama switches steps.
// (Option could easily be added to idyll itself)

const React = require("react");
const { filterChildren, mapChildren } = require("idyll-component-children");
import TextContainer from "idyll-components/dist/cjs/text-container";
const d3 = require("d3-selection");

const styles = {
  SCROLL_GRAPHIC: {
    top: 0,
    left: 0,
    right: 0,
    bottom: "auto",
    height: "100vh",
    width: "100%",
    transform: `translate3d(0, 0, 0)`,

    // todo: explore how to mess with z-index to allow hovering?
    zIndex: -1,
  },

  SCROLL_GRAPHIC_INNER: {
    position: "absolute",
    // right: '1rem',
    left: 0,
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
  },
};

let id = 0;

class MobileScroller extends React.Component {
  constructor(props) {
    super(props);
    this.id = id++;
    this.state = {
      graphicHeight: 0,
      graphicWidth: 0,
    };

    this.SCROLL_STEP_MAP = {};
    this.SCROLL_NAME_MAP = {};

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    require("intersection-observer");
    const scrollama = require("scrollama");
    // instantiate the scrollama
    this.scroller = scrollama();
    this.handleResize();

    // setup the instance, pass callback functions
    this.scroller
      .setup({
        step: `#idyll-scroll-${this.id} .idyll-step`, // required
        container: `#idyll-scroll-${this.id}`, // required (for sticky)
        graphic: `#idyll-scroll-${this.id} .idyll-scroll-graphic`, // required (for sticky)
        progress: this.props.progress !== undefined ? true : false,

        // we want steps to trigger pretty far down the screen,
        // so that you can still see the graph before the text
        // totally covers it up
        offset: 0.7,
      })
      .onStepEnter(this.handleStepEnter.bind(this))
      .onStepProgress(this.handleStepProgress.bind(this))
      // .onStepExit(handleStepExit)
      .onContainerEnter(this.handleContainerEnter.bind(this));
    //.onContainerExit(this.handleContainerExit.bind(this));

    // setup resize event
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    this.scroller.destroy();
  }

  handleStepEnter({ element, index, direction }) {
    this.SCROLL_STEP_MAP[index] && this.SCROLL_STEP_MAP[index]();
    let update = { currentStep: index };
    if (this.SCROLL_NAME_MAP[index]) {
      update.currentState = this.SCROLL_NAME_MAP[index];
    }
    this.props.updateProps && this.props.updateProps(update);
    if (index === Object.keys(this.SCROLL_STEP_MAP).length - 1) {
      d3.select("body").style("overflow", "auto");
    }
  }

  handleResize() {
    this.setState({
      graphicHeight: window.innerHeight + "px",
      graphicWidth: window.innerWidth + "px",
    });
  }

  handleContainerEnter(response) {
    if (
      this.props.disableScroll &&
      (!this.props.currentStep ||
        this.props.currentStep < Object.keys(this.SCROLL_STEP_MAP).length - 1)
    ) {
      d3.select("body").style("overflow", "hidden");
    }
  }

  handleStepProgress(response) {
    const { progress } = response;
    const update = { progress };
    this.props.updateProps && this.props.updateProps(update);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.disableScroll &&
      this.props.currentStep !== nextProps.currentStep
    ) {
      d3.selectAll(`#idyll-scroll-${this.id} .idyll-step`)
        .filter(function (d, i) {
          return i === nextProps.currentStep;
        })
        .node()
        .scrollIntoView({ behavior: "smooth" });
    }
    if (
      nextProps.disableScroll &&
      this.props.currentState !== nextProps.currentState
    ) {
      d3.selectAll(`#idyll-scroll-${this.id} .idyll-step`)
        .filter((d, i) => {
          return nextProps.currentState === this.SCROLL_NAME_MAP[i];
        })
        .node()
        .scrollIntoView({ behavior: "smooth" });
    }
    if (
      nextProps.disableScroll &&
      (!nextProps.currentStep ||
        nextProps.currentStep < Object.keys(this.SCROLL_STEP_MAP).length - 1)
    ) {
      d3.select("body").style("overflow", "hidden");
    }
  }

  registerStep(elt, name, val) {
    this.SCROLL_STEP_MAP[elt] = val;
    this.SCROLL_NAME_MAP[elt] = name;
  }

  render() {
    const { hasError, updateProps, idyll, children, ...props } = this.props;
    const { graphicHeight, graphicWidth } = this.state;

    const graphicChildren = filterChildren(children, (c) => {
      return c.type.name && c.type.name.toLowerCase() === "graphic";
    });

    return (
      <div
        ref={(ref) => (this.ref = ref)}
        className="idyll-scroll"
        id={`idyll-scroll-${this.id}`}
        style={Object.assign({ position: "relative" })}
      >
        {graphicChildren && graphicChildren.length ? (
          <div
            className="idyll-scroll-graphic"
            style={Object.assign(
              { height: graphicHeight },
              styles.SCROLL_GRAPHIC
            )}
          >
            <div
              style={Object.assign(
                { width: graphicWidth },
                styles.SCROLL_GRAPHIC_INNER
              )}
            >
              {graphicChildren}
            </div>
          </div>
        ) : null}
        <TextContainer idyll={idyll}>
          <div className="idyll-scroll-text">
            {mapChildren(
              filterChildren(children, (c) => {
                return !c.type.name || c.type.name.toLowerCase() === "step";
              }),
              (c) => {
                return React.cloneElement(c, {
                  registerStep: this.registerStep.bind(this),
                });
              }
            )}
          </div>
        </TextContainer>
      </div>
    );
  }
}

MobileScroller._idyll = {
  name: "MobileScroller",
  tagType: "open",
  children: [
    `
  [Graphic] This graphic stays fixed in the background.[/Graphic]
  [Step]This is the content for step 1[/Step]
  [Step]This is the content for step 2[/Step]
  [Step]This is the content for step 3[/Step]`,
  ],
  props: [
    {
      name: "currentStep",
      type: "integer",
      example: "0",
      description: "The index of the currently selected step.",
    },
    {
      name: "currentState",
      type: "object",
      example: "`{}`",
      description:
        "The state value associated with the currently selected step. Note you must set the state property on the step components for this value to update.",
    },
    {
      name: "progress",
      type: "number",
      example: "0",
      description:
        "The percent of completion (0-1) of the currently selected step",
    },
  ],
};

export default MobileScroller;
