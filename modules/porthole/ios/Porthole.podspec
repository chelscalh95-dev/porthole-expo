Pod::Spec.new do |s|
  s.name           = 'Porthole'
  s.version        = '1.0.0'
  s.summary        = 'Expo module bridging Atlantis (Porthole) to React Native'
  s.description    = 'In-app network inspector for React Native, powered by the Atlantis Swift package.'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = { :ios => '16.4' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  # Compile the Atlantis sources directly into this pod.
  # Bypasses cocoapods-spm and its linking bugs entirely.
  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}",
                   "../../../vendor/Porthole/Sources/**/*.swift"

  s.resource_bundles = {
    'AtlantisPrivacy' => ['../../../vendor/Porthole/Sources/PrivacyInfo.xcprivacy']
  }

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }
end