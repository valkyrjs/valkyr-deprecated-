Feature: Projection
  A projection represents the binding layer between write and read side of an application.
  An event exists in a write and read state, the write state is represented as a combined
  stream of events reduced to a single object. The same event exists on the read side in
  one of many representations, and can be considered a volatile existence.

  A projection handles one of three major behaviors. These are once, on and all, please
  see the Projection.ts file for more details on each of these.

  Scenario Outline: Projecting an event
    Given a projection that is registered under the "<method>" handler
    When the projected the event is hydrated <hydrated> and outdated <outdated>
    Then the projection outcome should be <outcome>

    Examples: 
      | method | hydrated | outdated | outcome |
      | once   | false    | false    | true    |
      | once   | true     | false    | false   |
      | once   | false    | true     | false   |
      | once   | true     | true     | false   |
      | on     | false    | false    | true    |
      | on     | true     | false    | true    |
      | on     | false    | true     | false   |
      | on     | true     | true     | false   |
      | all    | false    | false    | true    |
      | all    | true     | false    | true    |
      | all    | false    | true     | true    |
      | all    | true     | true     | true    |
