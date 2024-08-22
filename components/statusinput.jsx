import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import { hp } from '../helpers/common'

const StatusInput = (props) => {
  return (
    <View style={[styles.container, props.containerStyle && props.containerStyle]}>
        {props.icon && props.icon}
      <TextInput 
        style={{flex: 1}}
        placeholderTextColor={theme.colors.textLight}
        onChangeText={(text) => props.onChange(text)}  // <-- Format the text as HTML
        {...props}
      />
    </View>
  )
}

export default StatusInput

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: hp(7.2),
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 0.4,
        borderColor: theme.colors.text,
        borderRadius: theme.radius.xxl,
        paddingHorizontal: 18,
        gap: 12
    }
});

