import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';

const HomePage: React.FC = () => {
  const { featuredCourses, popularCourses, loading } = useCourse();

  useEffect(() => {
    // Additional initialization if needed
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 sm:py-32">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white mb-6">
                <span className="mr-2">🚀</span> Transform Your Career
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                  Learn Without
                </span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                  Limits
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Access 5,000+ professional courses with certificates. 
                Learn from industry experts and advance your career.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link 
                  to="/courses" 
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <span className="mr-3">🔍</span> Browse Courses
                </Link>
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-gray-900 bg-white border-2 border-gray-200 rounded-xl hover:border-indigo-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <span className="mr-3">🎯</span> Start Free Trial
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">5,000+</div>
                  <div className="text-sm text-gray-500 font-medium">Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">250k+</div>
                  <div className="text-sm text-gray-500 font-medium">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">98%</div>
                  <div className="text-sm text-gray-500 font-medium">Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-orange-600">24/7</div>
                  <div className="text-sm text-gray-500 font-medium">Support</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <div className="text-white text-center p-8">
                    <div className="text-6xl mb-6">🎓</div>
                    <h3 className="text-2xl font-bold mb-4">Interactive Learning</h3>
                    <p className="opacity-90">Live sessions • Hands-on projects • Peer collaboration</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-2xl">📈</span>
              </div>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Trainify</span>?
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to succeed in your learning journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🏅",
                title: "CPD Accredited",
                description: "All our courses are CPD accredited with recognized certificates",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: "🎬",
                title: "Video Lessons",
                description: "High-quality video content with subtitles and adjustable speed",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: "📱",
                title: "Learn Anywhere",
                description: "Access courses on desktop, tablet, or mobile devices",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: "📜",
                title: "Instant Certificates",
                description: "Receive certificates immediately upon course completion",
                color: "from-orange-500 to-amber-500"
              },
              {
                icon: "📊",
                title: "Progress Tracking",
                description: "Monitor your learning progress with detailed analytics",
                color: "from-red-500 to-rose-500"
              },
              {
                icon: "👥",
                title: "Community Support",
                description: "Join discussion forums and connect with other learners",
                color: "from-indigo-500 to-blue-500"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-2xl border border-gray-200 p-8 hover:border-transparent hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Featured <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Courses</span>
              </h2>
              <p className="text-xl text-gray-600">Most popular courses chosen by our students</p>
            </div>
            <Link 
              to="/courses" 
              className="inline-flex items-center text-lg font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View All Courses
              <span className="ml-2">→</span>
            </Link>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
              <p className="mt-4 text-gray-600">Loading courses...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredCourses.slice(0, 4).map(course => (
                <div 
                  key={course.id} 
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl hover:border-transparent transition-all duration-300"
                >
                  <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden">
                    {course.thumbnail ? (
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl text-white">📚</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-900">
                        {course.level}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        {course.category.name}
                      </span>
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="font-semibold text-gray-900">{course.average_rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                      {course.short_description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <span className="mr-1">⏱️</span> {course.duration_hours}h
                        </span>
                        <span className="flex items-center">
                          <span className="mr-1">👥</span> {course.total_enrollments}
                        </span>
                      </div>
                      <div className="text-lg font-bold">
                        {course.is_free ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          <span className="text-gray-900">${course.price}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/courses/${course.slug}`} 
                    className="absolute inset-0 z-10"
                    aria-label={`View ${course.title} course`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
            <div className="relative z-10 px-8 py-16 sm:p-16 text-center">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                Start Your Learning Journey Today
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto">
                Join over 250,000 professionals who have transformed their careers with Trainify
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-indigo-600 bg-white rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <span className="mr-3">🚀</span> Get Started Free
                </Link>
                <Link 
                  to="/pricing" 
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white border-2 border-white/30 rounded-xl hover:border-white/50 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-200"
                >
                  <span className="mr-3">👑</span> View Plans
                </Link>
              </div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute top-1/4 left-10 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl rotate-12" />
            <div className="absolute bottom-1/4 right-10 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl -rotate-12" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Students</span> Say
            </h2>
            <p className="text-xl text-gray-600">Real stories from real students</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The courses on Trainify transformed my career. The certificates are recognized by employers worldwide.",
                name: "Sarah Johnson",
                role: "Marketing Director",
                avatar: "👩‍💼",
                color: "from-blue-500 to-cyan-500"
              },
              {
                quote: "The flexibility to learn at my own pace while working full-time was exactly what I needed.",
                name: "Michael Chen",
                role: "Software Engineer",
                avatar: "👨‍💻",
                color: "from-purple-500 to-pink-500"
              },
              {
                quote: "The course quality exceeded my expectations. The instructors are industry experts.",
                name: "Emma Wilson",
                role: "Project Manager",
                avatar: "👩‍💼",
                color: "from-green-500 to-emerald-500"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl hover:border-transparent transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-2xl mb-6`}>
                  {testimonial.avatar}
                </div>
                <p className="text-gray-700 text-lg italic mb-8 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-20 pt-12 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
                <div className="text-gray-600">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
                <div className="text-gray-600">Industry Experts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
                <div className="text-gray-600">Learning Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">100+</div>
                <div className="text-gray-600">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;