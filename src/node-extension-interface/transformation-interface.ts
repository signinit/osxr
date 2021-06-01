import { MessageType } from ".";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

type Vector3 = [x: number, y: number, z: number];

type Quaternion = [x: number, y: number, z: number, w: number];

const RotationTransformationMessageType = new MessageType<
  [target: string, ...quaternion: Quaternion]
>("rotation-transformation");
const PositionTransformationMessageType = new MessageType<
  [target: string, ...position: Vector3]
>("position-transformation");

export const TransformationInterface = {
  sendRotation(target: string, ...quaternion: Quaternion) {
    RotationTransformationMessageType.send(target, ...quaternion);
  },

  sendPosition(target: string, ...position: Vector3) {
    PositionTransformationMessageType.send(target, ...position);
  },

  receiveRotation(target: string): Observable<Quaternion> {
    return RotationTransformationMessageType.receive().pipe(
      filter(([_target]) => _target === target),
      map(([, ...quaternion]) => quaternion)
    );
  },

  receivePosition(target: string): Observable<Vector3> {
    return PositionTransformationMessageType.receive().pipe(
        filter(([_target]) => _target === target),
        map(([, ...position]) => position)
      );
  },
};
