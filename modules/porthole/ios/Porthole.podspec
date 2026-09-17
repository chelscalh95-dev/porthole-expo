Pod::Spec.new do |s|
  s.name           = 'Porthole'
  s.version        = '1.0.0'
  s.summary        = 'Expo module bridging Atlantis to React Native'
  s.description    = 'In-app network inspector for React Native.'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = { :ios => '16.4' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'Atlantis'

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }
end