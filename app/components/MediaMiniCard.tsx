import Colors from '@/constants/Colors';
import { Media } from '@/types/Media';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type MediaMiniCardProps = {
	media: Media;
};

export default function MediaMiniCard({ media }: MediaMiniCardProps) {
	const router = useRouter();

	const handlePress = () => {
		router.push(`/media/${media.id}`);
	};

	return (
		<TouchableOpacity style={styles.container} onPress={handlePress}>
			<Image
				source={{ uri: media.posterUrl }}
				style={styles.poster}
				resizeMode='cover'
			/>

			<View style={styles.infoContainer}>
				<Text style={styles.title} numberOfLines={2}>
					{media.title}
				</Text>
				<Text style={styles.info}>
					{media.year} • {media.type === 'movie' ? 'Movie' : 'TV Show'}
				</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		backgroundColor: Colors.neutral[800],
		borderRadius: 8,
		overflow: 'hidden',
	},
	poster: {
		width: 70,
		height: 90,
	},
	infoContainer: {
		flex: 1,
		padding: 12,
		justifyContent: 'center',
	},
	title: {
		fontFamily: 'Inter-Medium',
		fontSize: 15,
		color: Colors.neutral[100],
		marginBottom: 4,
	},
	info: {
		fontFamily: 'Inter-Regular',
		fontSize: 13,
		color: Colors.neutral[400],
	},
});
