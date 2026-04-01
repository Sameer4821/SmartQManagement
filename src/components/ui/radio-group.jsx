import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';

export const RadioGroup = ({ value, onValueChange, children, style }) => {
  return (
    <View style={style}>
      {React.Children.map(children, child => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, {
          selectedValue: value,
          onValueChange: onValueChange
        });
      })}
    </View>
  );
};

export const RadioGroupItem = ({ value, selectedValue, onValueChange, id, label, style }) => {
  const isSelected = selectedValue === value;
  
  return (
    <TouchableOpacity
      style={[styles.itemWrap, style]}
      onPress={() => onValueChange(value)}
      activeOpacity={0.8}
    >
      <View style={[styles.radioOutline, isSelected && styles.radioOutlineSelected]}>
        {isSelected && <View style={styles.radioFilled} />}
      </View>
      {label && <Text style={styles.labelText}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  itemWrap: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  radioOutline: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center'
  },
  radioOutlineSelected: {
    borderColor: '#2563eb'
  },
  radioFilled: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#2563eb'
  },
  labelText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#334155'
  }
});