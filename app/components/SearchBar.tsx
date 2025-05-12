import React from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';

interface SearchBarProps extends TextInputProps {
  onSubmit?: () => void;
  onClear?: () => void;
}

export default function SearchBar({ 
  value, 
  onChangeText, 
  placeholder,
  onSubmit,
  onClear,
  ...props
}: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Search size={20} color={Colors.neutral[400]} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.neutral[500]}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        {...props}
      />
      {value && value.length > 0 && (
        <TouchableOpacity 
          style={styles.clearButton}
          onPress={() => {
            if (onChangeText) onChangeText('');
            if (onClear) onClear();
          }}>
          <X size={16} color={Colors.neutral[400]} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral[900],
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 24,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.neutral[100],
    height: '100%',
  },
  clearButton: {
    padding: 6,
  },
});