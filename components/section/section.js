import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Waypoint from 'react-waypoint';
import shortid from 'shortid';
import anime from 'animejs';
import MediaQuery from 'react-responsive';
import s from './section.css';

class Section extends Component {
  constructor(props) {
    super(props);
    this.onEnter = this.onEnter.bind(this);
    this.tl = null;
    this.hasAnimated = false;
  }

  componentDidMount() {
    if (window.innerWidth >= 768) {
      this.tl = anime.timeline();
    }
  }

  onEnter({ currentPosition, previousPosition }) {
    if (this.hasAnimated === false && window.innerWidth >= 768) {
      this.tl
        .add({
          targets: this.imgContainer,
          duration: 0,
          translateX: this.props.switch ? -100 : 100,
        })
        .add({
          targets: [this.content.children[0], this.content.children[1]],
          duration: 2000,
          easing: 'easeOutQuint',
          delay: (t, i) => i * 100 + 200,
          translateY: -50,
          opacity: [0, 1],
        })
        .add({
          targets: this.imgContainer,
          offset: '-=1200', // Starts 1000ms before the previous animation ends
          duration: 1200,
          easing: 'easeOutQuint',
          delay: (t, i) => i * 100 + 100,
          translateX: 0,
          opacity: [0, 1],
        });

      this.hasAnimated = true;
    }
  }

  /**
   * Renders section content
   *
   * @param {Boolean} isVisible
   */
  renderText() {
    const { title, desc, img, id, children } = this.props;

    return (
      <div
        className={classnames(`section-${id}`, s.contentContainer)}
        key={shortid.generate()}
        ref={r => (this.content = r)}
      >
        {children}
      </div>
    );
  }

  renderImage() {
    const { img, title } = this.props;

    return (
      <div
        key={shortid.generate()}
        ref={r => (this.imgContainer = r)}
        className={classnames(
          this.props.switch ? s.imgContainerLeft : s.imgContainer,
          s.imgDefaultContainers
        )}
      >
        <img src={img} alt={title} />
      </div>
    );
  }

  render() {
    const { img, title, id } = this.props;
    return (
      <section className={classnames(`section-${id}`, this.props.switch ? s.odd : '')}>
        <Waypoint onEnter={this.onEnter} bottomOffset="100px">
          <div className={classnames(s.container, 'container')}>
            <MediaQuery query="(max-width: 1023px)">
              {[this.renderText(), this.renderImage()]}
            </MediaQuery>
            <MediaQuery query="(min-width: 1024px)">
              {this.props.switch
                ? [this.renderImage(), this.renderText()]
                : [this.renderText(), this.renderImage()]}
            </MediaQuery>
          </div>
        </Waypoint>
      </section>
    );
  }
}

Section.propTypes = {
  children: PropTypes.node.isRequired,
  img: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  switch: PropTypes.bool,
};

export default Section;
