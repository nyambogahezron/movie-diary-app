import Colors from '@/constants/Colors';
import { Media } from '@/types/Media';
import { useRouter } from 'expo-router';
import { Film, Tv, Clock, Eye, Heart, Star } from 'lucide-react-native';
import {
	Dimensions,
	Image,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type MediaCardProps = {
	media: Media;
	type: 'movie' | 'tv';
};

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.38;

export default function MediaCard({ media, type }: MediaCardProps) {
	const router = useRouter();

	const handlePress = () => {
		router.push(`/media/${media.id}`);
	};

	return (
		<TouchableOpacity style={styles.container} onPress={handlePress}>
			<View style={styles.imageContainer}>
				<Image
					source={{ uri: media.posterUrl }}
					style={styles.poster}
					resizeMode='cover'
				/>
				<LinearGradient
					colors={['transparent', 'rgba(0,0,0,0.7)']}
					style={styles.gradient}
				/>
				<View style={styles.typeContainer}>
					{type === 'movie' ? (
						<Film size={16} color={Colors.primary[400]} />
					) : (
						<Tv size={16} color={Colors.success[400]} />
					)}
				</View>
				{media.progress !== undefined &&
					(media.progress.current / media.progress.total) * 100 < 100 && (
						<View style={styles.progressContainer}>
							<View
								style={[
									styles.progressBar,
									{
										width: `${
											(media.progress.current / media.progress.total) * 100
										}%`,
									},
								]}
							/>
						</View>
					)}
			</View>

			<View style={styles.contentContainer}>
				<Text style={styles.title} numberOfLines={2}>
					{media.title}
				</Text>

				<View style={styles.metaContainer}>
					<View style={styles.metaItem}>
						{type === 'movie' ? (
							<Film size={12} color={Colors.neutral[400]} />
						) : (
							<Tv size={12} color={Colors.neutral[400]} />
						)}
						<Text style={styles.metaText}>
							{type === 'movie' ? 'Movie' : 'TV'}
						</Text>
					</View>

					{media.dateWatched && (
						<View style={styles.metaItem}>
							<Clock size={12} color={Colors.neutral[400]} />
							<Text style={styles.metaText}>
								{new Date(media.dateWatched).toLocaleDateString()}
							</Text>
						</View>
					)}
				</View>

				{media.rating && (
					<View style={styles.ratingContainer}>
						<Star size={12} color={Colors.accent[500]} />
						<Text style={styles.ratingText}>{media.rating}</Text>
					</View>
				)}

				{media.status && (
					<View
						style={[
							styles.statusContainer,
							{
								backgroundColor:
									media.status === 'Currently Watching'
										? Colors.primary[900]
										: media.status === 'Completed'
										? Colors.success[900]
										: media.status === 'Planning to Watch'
										? Colors.accent[900]
										: media.status === 'Paused'
										? Colors.warning[900]
										: Colors.error[900],
							},
						]}
					>
						<Text
							style={[
								styles.statusText,
								{
									color:
										media.status === 'Currently Watching'
											? Colors.primary[200]
											: media.status === 'Completed'
											? Colors.success[200]
											: media.status === 'Planning to Watch'
											? Colors.accent[200]
											: media.status === 'Paused'
											? Colors.warning[200]
											: Colors.error[200],
								},
							]}
						>
							{media.status}
						</Text>
					</View>
				)}

				<View style={styles.footerContainer}>
					{media.rewatches !== undefined && media.rewatches > 0 && (
						<View style={styles.metaItem}>
							<Eye size={12} color={Colors.neutral[400]} />
							<Text style={styles.metaText}>
								{media.rewatches === 1
									? 'Watched once'
									: `Watched ${media.rewatches} times`}
							</Text>
						</View>
					)}

					{media.favorite && (
						<View style={styles.metaItem}>
							<Heart size={12} color={Colors.error[400]} />
							<Text style={[styles.metaText, { color: Colors.error[400] }]}>
								Favorite
							</Text>
						</View>
					)}
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	container: {
		width: CARD_WIDTH,
		marginRight: 16,
		backgroundColor: Colors.neutral[900],
		borderRadius: 12,
		overflow: 'hidden',
	},
	imageContainer: {
		width: '100%',
		height: CARD_WIDTH * 1.5,
		position: 'relative',
	},
	poster: {
		width: '100%',
		height: '100%',
	},
	gradient: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: '50%',
	},
	typeContainer: {
		position: 'absolute',
		top: 8,
		left: 8,
		backgroundColor: 'rgba(0,0,0,0.7)',
		padding: 4,
		borderRadius: 4,
	},
	progressContainer: {
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		height: 4,
		backgroundColor: Colors.neutral[700],
	},
	progressBar: {
		height: '100%',
		backgroundColor: Colors.primary[500],
	},
	contentContainer: {
		padding: 16,
		flex: 1,
	},
	title: {
		fontFamily: 'Inter-Medium',
		fontSize: 15,
		color: Colors.neutral[100],
		marginBottom: 8,
	},
	metaContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	metaItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: 12,
	},
	metaText: {
		fontFamily: 'Inter-Regular',
		fontSize: 12,
		color: Colors.neutral[400],
		marginLeft: 4,
	},
	ratingContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
	},
	ratingText: {
		fontFamily: 'Inter-Medium',
		fontSize: 12,
		color: Colors.accent[500],
		marginLeft: 4,
	},
	statusContainer: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		alignSelf: 'flex-start',
		marginBottom: 8,
	},
	statusText: {
		fontFamily: 'Inter-Medium',
		fontSize: 12,
	},
	footerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: 'auto',
	},
});
