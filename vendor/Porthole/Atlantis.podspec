Pod::Spec.new do |s|
  s.name         = 'Atlantis'
  s.version      = '1.0.0'
  s.summary      = 'Network inspector library'
  s.description  = 'Atlantis network capture library'
  s.homepage     = 'https://github.com/sohandotgit/Porthole'
  s.license      = 'MIT'
  s.author       = 'Porthole'
  s.platform     = :ios, '16.4'
  s.source       = { :path => '.' }
  s.source_files = 'Sources/*.swift'
  s.resource_bundles = { 'AtlantisPrivacy' => ['Sources/PrivacyInfo.xcprivacy'] }
  s.swift_version = '5.9'
end