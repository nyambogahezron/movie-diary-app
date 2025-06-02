import Colors from '@/constants/Colors';
import { Check, X } from 'lucide-react-native';
import { useState } from 'react';
import {
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

type FilterOption = {
	id: string;
	label: string;
};

type FilterSection = {
	title: string;
	options: FilterOption[];
	type: 'single' | 'multiple';
};

interface FilterModalProps {
	visible: boolean;
	onClose: () => void;
	onApply: (filters: Record<string, string[]>) => void;
	initialFilters?: Record<string, string[]>;
}

const FILTER_SECTIONS: FilterSection[] = [
	{
		title: 'Genre',
		type: 'multiple',
		options: [
			{ id: 'action', label: 'Action' },
			{ id: 'comedy', label: 'Comedy' },
			{ id: 'drama', label: 'Drama' },
			{ id: 'fantasy', label: 'Fantasy' },
			{ id: 'horror', label: 'Horror' },
			{ id: 'romance', label: 'Romance' },
			{ id: 'sci-fi', label: 'Sci-Fi' },
			{ id: 'thriller', label: 'Thriller' },
		],
	},
	{
		title: 'Year',
		type: 'multiple',
		options: [
			{ id: '2024', label: '2024' },
			{ id: '2023', label: '2023' },
			{ id: '2022', label: '2022' },
			{ id: '2021', label: '2021' },
			{ id: '2020', label: '2020' },
			{ id: 'older', label: 'Older' },
		],
	},
	{
		title: 'Rating',
		type: 'single',
		options: [
			{ id: 'any', label: 'Any Rating' },
			{ id: '4plus', label: '4+ Stars' },
			{ id: '3plus', label: '3+ Stars' },
			{ id: '2plus', label: '2+ Stars' },
		],
	},
];

export default function FilterModal({
	visible,
	onClose,
	onApply,
	initialFilters = {},
}: FilterModalProps) {
	const [selectedFilters, setSelectedFilters] =
		useState<Record<string, string[]>>(initialFilters);

	const handleOptionPress = (section: FilterSection, optionId: string) => {
		setSelectedFilters((prev) => {
			const currentSection = prev[section.title] || [];

			if (section.type === 'single') {
				return {
					...prev,
					[section.title]: [optionId],
				};
			}

			if (currentSection.includes(optionId)) {
				return {
					...prev,
					[section.title]: currentSection.filter((id) => id !== optionId),
				};
			}

			return {
				...prev,
				[section.title]: [...currentSection, optionId],
			};
		});
	};

	const handleApply = () => {
		onApply(selectedFilters);
		onClose();
	};

	const isOptionSelected = (section: FilterSection, optionId: string) => {
		return selectedFilters[section.title]?.includes(optionId) || false;
	};

	return (
		<Modal
			visible={visible}
			animationType='slide'
			transparent={true}
			onRequestClose={onClose}
		>
			<View style={styles.modalOverlay}>
				<View style={styles.modalContent}>
					<View style={styles.header}>
						<Text style={styles.title}>Filter Options</Text>
						<TouchableOpacity onPress={onClose} style={styles.closeButton}>
							<X size={24} color={Colors.neutral[400]} />
						</TouchableOpacity>
					</View>

					<ScrollView style={styles.scrollView}>
						{FILTER_SECTIONS.map((section) => (
							<View key={section.title} style={styles.section}>
								<Text style={styles.sectionTitle}>{section.title}</Text>
								<View style={styles.optionsContainer}>
									{section.options.map((option) => (
										<TouchableOpacity
											key={option.id}
											style={[
												styles.optionButton,
												isOptionSelected(section, option.id) &&
													styles.optionButtonActive,
											]}
											onPress={() => handleOptionPress(section, option.id)}
										>
											<Text
												style={[
													styles.optionText,
													isOptionSelected(section, option.id) &&
														styles.optionTextActive,
												]}
											>
												{option.label}
											</Text>
											{isOptionSelected(section, option.id) && (
												<Check
													size={16}
													color={Colors.primary[500]}
													style={styles.checkIcon}
												/>
											)}
										</TouchableOpacity>
									))}
								</View>
							</View>
						))}
					</ScrollView>

					<View style={styles.footer}>
						<TouchableOpacity
							style={styles.resetButton}
							onPress={() => setSelectedFilters({})}
						>
							<Text style={styles.resetButtonText}>Reset</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.applyButton} onPress={handleApply}>
							<Text style={styles.applyButtonText}>Apply Filters</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'flex-end',
	},
	modalContent: {
		backgroundColor: Colors.neutral[900],
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		height: '80%',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: Colors.neutral[800],
	},
	title: {
		fontFamily: 'Inter-Bold',
		fontSize: 20,
		color: Colors.neutral[100],
	},
	closeButton: {
		padding: 4,
	},
	scrollView: {
		flex: 1,
	},
	section: {
		padding: 16,
		borderBottomWidth: 1,
		borderBottomColor: Colors.neutral[800],
	},
	sectionTitle: {
		fontFamily: 'Inter-Medium',
		fontSize: 16,
		color: Colors.neutral[200],
		marginBottom: 12,
	},
	optionsContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: 8,
	},
	optionButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: 12,
		paddingVertical: 8,
		backgroundColor: Colors.neutral[800],
		borderRadius: 20,
		marginRight: 8,
		marginBottom: 8,
	},
	optionButtonActive: {
		backgroundColor: Colors.primary[900],
	},
	optionText: {
		fontFamily: 'Inter-Medium',
		fontSize: 14,
		color: Colors.neutral[300],
	},
	optionTextActive: {
		color: Colors.primary[500],
	},
	checkIcon: {
		marginLeft: 4,
	},
	footer: {
		flexDirection: 'row',
		padding: 16,
		borderTopWidth: 1,
		borderTopColor: Colors.neutral[800],
		gap: 12,
	},
	resetButton: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 12,
		backgroundColor: Colors.neutral[800],
		alignItems: 'center',
	},
	resetButtonText: {
		fontFamily: 'Inter-Medium',
		fontSize: 16,
		color: Colors.neutral[300],
	},
	applyButton: {
		flex: 2,
		paddingVertical: 12,
		borderRadius: 12,
		backgroundColor: Colors.primary[500],
		alignItems: 'center',
	},
	applyButtonText: {
		fontFamily: 'Inter-Medium',
		fontSize: 16,
		color: Colors.neutral[950],
	},
});
