// Update the gender options array in the renderStep function
const genderOptions = ['Male', 'Female'].map((gender) => (
  <TouchableOpacity
    key={gender}
    style={[
      styles.genderOption,
      formData.gender === gender && styles.genderOptionSelected
    ]}
    onPress={() => updateFormData('gender', gender)}
  >
    <Text style={styles.genderSymbol}>
      {gender === 'Male' ? '♂' : '♀'}
    </Text>
    <Text style={[
      styles.genderText,
      formData.gender === gender && styles.genderTextSelected
    ]}>
      {gender}
    </Text>
  </TouchableOpacity>
));

export default genderOptions