import Colors from '@/constants/Colors';
import { useLibrary } from '@/hooks/useLibrary';
import { useTrendingContent } from '@/hooks/useTrendingContent';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Heart } from 'lucide-react-native';
import { useRef, useState } from 'react';
import {
	Animated,
	Dimensions,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HEADER_HEIGHT = 400;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 70;

export default function MediaDetailsScreen() {
	const { id } = useLocalSearchParams();
	const router = useRouter();
	const scrollY = useRef(new Animated.Value(0)).current;
	const [isFavorite, setIsFavorite] = useState(false);

	// Get media data from trending content and library
	const { trendingMovies, trendingShows } = useTrendingContent();
	const { watchlistContent } = useLibrary();

	// Find the media item from all sources
	const media = [...trendingMovies, ...trendingShows, ...watchlistContent].find(
		(item) => item.id.toString() === id
	);

	if (!media) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>Media not found</Text>
			</View>
		);
	}

	// Animation values
	const headerHeight = scrollY.interpolate({
		inputRange: [0, HEADER_HEIGHT - HEADER_MIN_HEIGHT],
		outputRange: [HEADER_HEIGHT, HEADER_MIN_HEIGHT],
		extrapolate: 'clamp',
	});

	const imageOpacity = scrollY.interpolate({
		inputRange: [0, HEADER_HEIGHT - HEADER_MIN_HEIGHT],
		outputRange: [1, 0.3],
		extrapolate: 'clamp',
	});

	const headerTitleOpacity = scrollY.interpolate({
		inputRange: [0, HEADER_HEIGHT - HEADER_MIN_HEIGHT],
		outputRange: [0, 1],
		extrapolate: 'clamp',
	});

	const favoriteButtonScale = scrollY.interpolate({
		inputRange: [0, HEADER_HEIGHT - HEADER_MIN_HEIGHT],
		outputRange: [1, 0.8],
		extrapolate: 'clamp',
	});

	return (
		<View style={styles.container}>
			<Animated.View style={[styles.header, { height: headerHeight }]}>
				<Animated.Image
					source={{ uri: media.posterUrl }}
					style={[styles.headerImage, { opacity: imageOpacity }]}
					resizeMode='cover'
				/>

				{/* Header content */}
				<View style={styles.headerContent}>
					<Animated.View
						style={[
							styles.headerTitleContainer,
							{ opacity: headerTitleOpacity },
						]}
					>
						<Text style={styles.headerTitle} numberOfLines={1}>
							{media.title}
						</Text>
					</Animated.View>

					<View style={styles.headerButtons}>
						<TouchableOpacity
							style={styles.backButton}
							onPress={() => router.back()}
						>
							<ChevronLeft size={24} color={Colors.neutral[100]} />
						</TouchableOpacity>

						<Animated.View
							style={{ transform: [{ scale: favoriteButtonScale }] }}
						>
							<TouchableOpacity
								style={[
									styles.favoriteButton,
									isFavorite && styles.favoriteButtonActive,
								]}
								onPress={() => setIsFavorite(!isFavorite)}
							>
								<Heart
									size={24}
									color={isFavorite ? Colors.neutral[100] : Colors.neutral[100]}
									fill={isFavorite ? Colors.neutral[100] : 'transparent'}
								/>
							</TouchableOpacity>
						</Animated.View>
					</View>
				</View>
			</Animated.View>

			<Animated.ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollContent}
				showsVerticalScrollIndicator={false}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { y: scrollY } } }],
					{ useNativeDriver: false }
				)}
				scrollEventThrottle={16}
			>
				<View style={styles.content}>
					<Text style={styles.title}>{media.title}</Text>
					<Text style={styles.info}>
						{media.year} • {media.type === 'movie' ? 'Movie' : 'TV Show'}
					</Text>

					{/* Add more content here */}

					<Text style={{ color: 'white' }}>
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Blanditiis
						saepe incidunt labore velit cupiditate quidem maiores quas quis
						ducimus aut inventore optio voluptatem molestiae qui sunt, est omnis
						architecto unde repudiandae excepturi eligendi quam dolores
						reprehenderit ut! Omnis reiciendis repellat blanditiis excepturi,
						inventore illo voluptate placeat doloribus rerum quae, eveniet, in
						vel ad ratione dolor nobis aut minima. Labore temporibus repellat
						deserunt aspernatur odit minima esse. Modi dolor, repudiandae
						deserunt id eius atque numquam consectetur! Quas, voluptatibus
						officiis accusamus, asperiores alias, adipisci distinctio maiores in
						eos possimus laudantium iste maxime enim minus non a suscipit veniam
						quos earum. Vel, voluptatum. Eos debitis in quasi veritatis dolor
						corporis qui, dignissimos tempore perspiciatis fugiat, ut
						consectetur quidem laudantium, officia dolorem voluptatum
						temporibus. Soluta voluptates labore commodi suscipit odit aut
						praesentium aliquid debitis dolores cumque, non ratione nobis error
						architecto nisi voluptatibus hic sint amet? Ipsa perspiciatis
						aspernatur dolore ratione suscipit vel rem sunt quas ullam
						asperiores fugit corporis, culpa corrupti quaerat, odit recusandae
						dolorum praesentium error hic et possimus non quidem fuga voluptate?
						Illo hic laudantium illum sint cumque, eaque laborum porro atque
						incidunt ex recusandae esse praesentium vero accusantium tempore
						maxime corrupti alias. Asperiores sed autem sunt aperiam cumque
						incidunt quam quo eos velit, nam dolores sint facere quidem nisi,
						ipsa aliquid eaque ipsum reprehenderit nesciunt. Vitae doloremque
						saepe unde iusto dolorum harum magni obcaecati doloribus architecto
						explicabo corporis quibusdam nisi, aspernatur pariatur culpa dolor
						quaerat expedita. Natus, deleniti. Nobis impedit veritatis alias,
						incidunt, molestiae deleniti quibusdam in ducimus doloribus libero
						nesciunt quo enim, officia harum nisi eligendi qui repellat expedita
						deserunt facere aliquid. Corporis error provident magnam commodi
						animi consectetur, ullam odio, ipsum et distinctio eaque, eius
						quasi! Odit expedita perferendis eaque commodi nesciunt sequi
						assumenda dicta aliquid repudiandae pariatur! Odio iure amet
						molestiae velit, quae quod neque perferendis eos earum voluptatem
						officiis. Quibusdam incidunt voluptatum accusantium aut ex labore
						inventore possimus id repellat dolores voluptatibus sit suscipit
						omnis officiis adipisci, magni necessitatibus? Aut officia, fugit
						nam perferendis dolores, ea ipsum debitis minus repellendus
						necessitatibus modi eius, vero eos perspiciatis. Soluta provident
						tempora distinctio, deleniti fugiat ab. Unde placeat et sequi
						accusamus aut quibusdam expedita voluptas est dolore eveniet modi
						neque debitis consequatur quae aperiam eligendi repudiandae adipisci
						iure exercitationem obcaecati ullam beatae, minus deserunt. Eum quo
						corrupti ipsa obcaecati veniam totam aspernatur, atque dolorum modi
						quibusdam deserunt autem facere porro vero aut reiciendis aliquid
						distinctio provident sit et inventore, sint incidunt. Quasi in ipsa
						blanditiis totam accusantium ex beatae expedita laudantium facere
						distinctio, non possimus, consectetur quod perferendis. Sapiente
						repudiandae rem atque odit asperiores fugit deserunt aliquam
						recusandae impedit labore pariatur suscipit temporibus nulla, ullam
						quam culpa nam dolores eos esse sint similique blanditiis. Iure
						expedita, deserunt magni illum assumenda mollitia ipsam voluptates
						delectus reiciendis sequi repudiandae, consequuntur quod, dolor
						officiis illo ad deleniti! Maiores perspiciatis, cum quaerat nostrum
						provident corrupti, amet quod necessitatibus perferendis aliquid
						tempore incidunt asperiores velit enim optio beatae sequi. Earum
						consectetur, quae unde fuga quidem maiores totam voluptates dolores
						necessitatibus iusto quo, pariatur incidunt. Lorem ipsum dolor sit
						amet consectetur adipisicing elit. Dolores excepturi neque id ipsa
						labore repellendus sed, consequatur, natus praesentium eligendi
						facilis atque. Laborum inventore dolor impedit architecto sunt
						aperiam ex maiores. Consequuntur, numquam beatae corrupti corporis
						nobis totam, officia veritatis tempora voluptas eaque illum eos
						nesciunt enim velit tempore architecto, odit qui illo accusamus
						eligendi doloremque provident ad repudiandae eius? Ipsum voluptatem
						doloribus, ipsam in quam illo, nam architecto dicta, quia eum labore
						excepturi? Consequatur officiis ipsa libero nisi corporis
						exercitationem veniam reprehenderit eius laboriosam voluptas rerum
						dicta quod, veritatis quam eaque velit blanditiis at esse molestiae
						ex tempore provident. Molestiae, iure tempora adipisci facilis
						obcaecati labore nisi laborum quam ipsam voluptatibus deleniti eos
						cumque ad et blanditiis, magni ab tenetur eligendi! Repellendus eos,
						officia minima explicabo, totam reiciendis ipsum laborum accusantium
						nobis, dolores maxime recusandae mollitia repellat tempora saepe
						provident dignissimos atque eaque. Necessitatibus neque dolore
						beatae modi quas, sed tempore alias, perspiciatis nobis, cum
						inventore ad. Obcaecati aliquam expedita nobis facere. Quas dolores
						earum recusandae magnam repellendus sed nesciunt voluptatem ex esse
						excepturi, molestias a eligendi soluta animi ut commodi sit ipsa
						accusamus in nisi. Unde, tempora voluptatibus aperiam minima eaque
						odit provident culpa necessitatibus repellat ipsum inventore?
					</Text>
				</View>
			</Animated.ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.neutral[950],
	},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		zIndex: 100,
		overflow: 'hidden',
	},
	headerImage: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		width: '100%',
		height: '100%',
	},
	headerContent: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		paddingTop: Platform.OS === 'ios' ? 50 : 30,
		paddingHorizontal: 16,
	},
	headerTitleContainer: {
		position: 'absolute',
		top: Platform.OS === 'ios' ? 50 : 30,
		left: 16,
		right: 16,
		alignItems: 'center',
	},
	headerTitle: {
		fontFamily: 'Inter-SemiBold',
		fontSize: 18,
		color: Colors.neutral[100],
	},
	headerButtons: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	backButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	favoriteButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		alignItems: 'center',
		justifyContent: 'center',
	},
	favoriteButtonActive: {
		backgroundColor: Colors.primary[500],
	},
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		paddingTop: HEADER_HEIGHT,
	},
	content: {
		padding: 16,
	},
	title: {
		fontFamily: 'Inter-SemiBold',
		fontSize: 24,
		color: Colors.neutral[100],
		marginBottom: 8,
	},
	info: {
		fontFamily: 'Inter-Regular',
		fontSize: 16,
		color: Colors.neutral[400],
		marginBottom: 16,
	},
	errorContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: Colors.neutral[950],
	},
	errorText: {
		fontFamily: 'Inter-Medium',
		fontSize: 16,
		color: Colors.neutral[400],
	},
});
