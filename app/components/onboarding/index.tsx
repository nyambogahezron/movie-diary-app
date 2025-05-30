import { ArrowRight } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import {
	StyleSheet,
	Text,
	TouchableOpacity,
	useWindowDimensions,
	View,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { slides } from './onboardingData';
import HistoryAnimation from './steps/HistoryAnimation';
import SocialAnimation from './steps/SocialAnimation';
import TrackAnimation from './steps/TrackAnimation';
import WatchlistAnimation from './steps/WatchlistAnimation';

interface OnboardingProps {
	onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
	const [currentSlide, setCurrentSlide] = useState(0);
	const { width } = useWindowDimensions();

	const goToNextSlide = useCallback(() => {
		if (currentSlide === slides.length - 1) {
			onComplete();
		} else {
			setCurrentSlide((prev) => prev + 1);
		}
	}, [currentSlide, onComplete]);

	const getAnimationComponent = (id: string) => {
		switch (id) {
			case 'track':
				return <TrackAnimation />;
			case 'history':
				return <HistoryAnimation />;
			case 'watchlist':
				return <WatchlistAnimation />;
			case 'social':
				return <SocialAnimation />;
			default:
				return null;
		}
	};

	return (
		<View style={styles.container}>
			<TouchableOpacity style={styles.skipButton} onPress={onComplete}>
				<Text style={styles.skipText}>Skip</Text>
			</TouchableOpacity>

			<View style={styles.content}>
				<Animated.View
					entering={FadeIn.duration(500)}
					exiting={FadeOut.duration(500)}
					style={[styles.slide, { width }]}
				>
					{getAnimationComponent(slides[currentSlide].id)}
					<Text style={styles.title}>{slides[currentSlide].title}</Text>
					<Text style={styles.description}>
						{slides[currentSlide].description}
					</Text>
				</Animated.View>
			</View>

			<View style={styles.footer}>
				<View style={styles.dots}>
					{slides.map((_, index) => (
						<View
							key={index}
							style={[styles.dot, currentSlide === index && styles.activeDot]}
						/>
					))}
				</View>

				<TouchableOpacity
					style={styles.button}
					onPress={goToNextSlide}
					activeOpacity={0.8}
				>
					<Text style={styles.buttonText}>
						{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
					</Text>
					{currentSlide !== slides.length - 1 && (
						<ArrowRight size={20} color='#fff' style={styles.buttonIcon} />
					)}
				</TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#111827',
	},
	skipButton: {
		position: 'absolute',
		top: 48,
		right: 24,
		zIndex: 1,
	},
	skipText: {
		color: '#9CA3AF',
		fontSize: 14,
		fontWeight: '500',
	},
	content: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	slide: {
		alignItems: 'center',
		paddingHorizontal: 24,
	},
	title: {
		fontSize: 28,
		fontWeight: 'bold',
		color: '#fff',
		textAlign: 'center',
		marginBottom: 16,
	},
	description: {
		fontSize: 16,
		color: '#9CA3AF',
		textAlign: 'center',
		marginBottom: 32,
	},
	footer: {
		padding: 24,
		alignItems: 'center',
	},
	dots: {
		flexDirection: 'row',
		marginBottom: 32,
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
		backgroundColor: 'rgba(156, 163, 175, 0.4)',
		marginHorizontal: 4,
	},
	activeDot: {
		width: 24,
		backgroundColor: '#8B5CF6',
	},
	button: {
		backgroundColor: '#8B5CF6',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		paddingHorizontal: 32,
		paddingVertical: 16,
		borderRadius: 9999,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
	buttonIcon: {
		marginLeft: 8,
	},
});
