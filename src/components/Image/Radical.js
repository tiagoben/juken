import React from 'react';
import PropTypes from 'prop-types';
import { Image, StyleSheet } from 'react-native';
import device from 'src/utils/device';

const Radical = props => {
  return (
    <Image
      source={{ uri: props.src }}
      style={[
        props.style,
        styles.image,
      ]}
    />
  )
};

Radical.propTypes = {
  src: PropTypes.string,
  style: PropTypes.object,
};

const styles = StyleSheet.create({
  image: device({
    web: { filter: 'invert(45%) sepia(100%) saturate(1274%) hue-rotate(177deg) brightness(101%) contrast(94%)' }
  })
})

export default Radical;