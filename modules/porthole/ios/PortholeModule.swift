import ExpoModulesCore
import Atlantis

public class PortholeModule: Module, AtlantisDelegate {
    private let store = Atlantis.trafficStore

    public func definition() -> ModuleDefinition {
        Name("Porthole")

        // ── Lifecycle ──
        OnCreate {
            // Register as the Atlantis delegate. Atlantis holds this weakly,
            // but the Expo runtime retains the module instance.
            Atlantis.setDelegate(self)
        }

        // ── Constants ──
        Constant("version") {
            Atlantis.buildVersion
        }

        // ── Capture control ──
        AsyncFunction("startCapture") { (promise: Promise) in
            Atlantis.start()
            promise.resolve(["status": "started"])
        }

        AsyncFunction("stopCapture") { (promise: Promise) in
            Atlantis.stop()
            promise.resolve(["status": "stopped"])
        }

        // ── Pause / resume ──
        AsyncFunction("setPaused") { (paused: Bool) in
            self.store.isPaused = paused
        }

        AsyncFunction("getPaused") { () -> Bool in
            self.store.isPaused
        }

        // ── Query ──
        AsyncFunction("getTransactions") { (offset: Int, limit: Int, promise: Promise) in
            let slice = Array(self.store.packages.dropFirst(offset).prefix(limit))
            promise.resolve(slice.map(Self.serialize))
        }

        AsyncFunction("getTransaction") { (id: String, promise: Promise) in
            let match = self.store.packages.first(where: { $0.id == id })
            promise.resolve(match.map(Self.serialize))
        }

        AsyncFunction("getCount") { () -> Int in
            self.store.packages.count
        }

        // ── Mutations ──
        AsyncFunction("clearTransactions") {
            self.store.clear()
        }

        AsyncFunction("removeTransaction") { (id: String) in
            if let match = self.store.packages.first(where: { $0.id == id }) {
                self.store.remove(match)
            }
        }

        // ── Events ──
        Events("onNewPackage")
    }

    // MARK: - AtlantisDelegate

    public func atlantisDidHaveNewPackage(_ package: TrafficPackage) {
        // Atlantis dispatches this on the main thread already.
        sendEvent("onNewPackage", Self.summary(package))
    }

    // MARK: - Serialization

    /// Lightweight row for the list view.
    private static func summary(_ pkg: TrafficPackage) -> [String: Any?] {
        return [
            "id": pkg.id,
            "url": pkg.request.url,
            "method": pkg.request.method,
            "statusCode": pkg.response?.statusCode,
            "packageType": pkg.packageType.rawValue,
            "startAt": pkg.startAt,
            "endAt": pkg.endAt,
            "hasError": pkg.error != nil
        ]
    }

    /// Full detail for the detail view.
    private static func serialize(_ pkg: TrafficPackage) -> [String: Any?] {
        return [
            "id": pkg.id,
            "startAt": pkg.startAt,
            "endAt": pkg.endAt,
            "packageType": pkg.packageType.rawValue,

            "request": [
                "url": pkg.request.url,
                "method": pkg.request.method,
                "headers": pkg.request.headers.map { ["key": $0.key, "value": $0.value] },
                "body": pkg.request.body?.base64EncodedString()
            ],

            "response": pkg.response.map { resp -> [String: Any?] in
                [
                    "statusCode": resp.statusCode,
                    "headers": resp.headers.map { ["key": $0.key, "value": $0.value] }
                ]
            },

            "error": pkg.error.map { err -> [String: Any?] in
                ["code": err.code, "message": err.message]
            },

            "responseBody": pkg.responseBodyData.isEmpty
                ? nil
                : pkg.responseBodyData.base64EncodedString(),

            "websocketMessages": pkg.websocketMessages.map { msg -> [String: Any?] in
                [
                    "createdAt": msg.createdAt,
                    "messageType": msg.messageType.rawValue,
                    "stringValue": msg.stringValue,
                    "dataValue": msg.dataValue?.base64EncodedString()
                ]
            }
        ]
    }
}