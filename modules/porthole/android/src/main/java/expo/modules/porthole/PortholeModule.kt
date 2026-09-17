package expo.modules.porthole

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class PortholeModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("Porthole")

    Events("onChange")

    Constant("PI") {
      Math.PI
    }

    AsyncFunction("setValueAsync") { value: String ->
      sendEvent("onChange", mapOf(
        "value" to value
      ))
    }
  }
}
