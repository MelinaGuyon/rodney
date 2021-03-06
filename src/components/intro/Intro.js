import React from 'react';
import i18n from 'abstract/i18n/i18n';
import store from 'tools//store';
import anime from 'animejs';

require('./Intro.scss');

class Intro extends React.Component {
  component = React.createRef();
  animation = React.createRef();

  constructor (props) {
    super(props);
    this.state = {
      swipe: false,
      hidden: false,
      titleNumber: Object.keys(i18n.localize('intro').title).length
    }
  }

  componentDidMount () {
    setTimeout(this.handleSwipe, 600); // passer vite
    // setTimeout(this.animate, 200);
  }

  bind = () => {
    store.watch('swipe', this.handleSwipe);
  }

  unbind = () => {
    store.unwatch('swipe', this.handleSwipe);
  }

  handleSwipe = () => {
    this.unbind();
    store.set('start', 0);
    this.setState({ 'hidden': true });
  }

  allowSwipe = () => {
    this.bind();
    this.setState({ 'swipe': true })
  }

  animate = () => {
    const tl = anime.timeline({
      easing: 'easeOutQuad',
      duration: 400
    });

    const items = [...this.animation.current.querySelectorAll('.item')];
    for (let i = 0; i < items.length; i++) {
      tl
        .add({
          targets: items[i],
          opacity: 1,
          translateY: [i === 0 ? 0 : -30, 0],
          delay: 250,
          complete: () => {
            if (i === this.state.titleNumber) return this.allowSwipe();
            anime({
              targets: items[i],
              opacity: 0,
              translateY: [0, 30],
              easing: 'easeOutQuad',
              duration: 400,
              delay: 100
            })
          }
        })
    }
  }

  render () {
    const { swipe, hidden } = this.state;
    const intro = i18n.localize('intro');

    return (
      <div className={'intro ' + (hidden ? 'hidden' : '') } ref={this.component}>
        <div className='title'>
          <span className='base' >{intro.titleBase}</span>
          <div className='animation' ref={this.animation}>
            <span className='item'>{intro.title.text}</span>
            <img className='item img' src="./images/home/01.jpg" alt=""/>
            <img className='item img' src="./images/home/02.jpg" alt=""/>
            <img className='item img' src="./images/home/03.png" alt=""/>
            <span className='item'>{intro.title.text}</span>
          </div>
        </div>
        <div className={'cta ' + (swipe ? 'active' : '') }>
          <span>{intro.cta}</span>
        </div>
      </div>
    );
  }
}

export default Intro;
