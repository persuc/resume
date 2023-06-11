import type { LevelSpec } from '@/ts/draw-mode/Level'
import BalancedBetweenSticks from '@/ts/draw-mode/levels/begin/BalancedBetweenSticks'
import BallBesideHill from '@/ts/draw-mode/levels/begin/BallBesideHill'
import BallInCup from '@/ts/draw-mode/levels/begin/BallInCup'
import BallOnCube from '@/ts/draw-mode/levels/begin/BallOnCube'
import BallOnFloor from '@/ts/draw-mode/levels/begin/BallOnFloor'
import BallOnRope from '@/ts/draw-mode/levels/begin/BallOnRope'
import BallOnStilts from '@/ts/draw-mode/levels/begin/BallOnStilts'
import BallUnderClutter from '@/ts/draw-mode/levels/begin/BallUnderClutter'
import Chasm from '@/ts/draw-mode/levels/begin/Chasm'
import NoDrawAfterAwaken from '@/ts/draw-mode/levels/begin/NoDrawAfterAwaken'
import NoDrawOverhang from '@/ts/draw-mode/levels/begin/NoDrawOverhang'
import NoDrawRamp from '@/ts/draw-mode/levels/begin/NoDrawRamp'
import NoDrawRampTarget from '@/ts/draw-mode/levels/begin/NoDrawRampTarget'
import SleepingBall from '@/ts/draw-mode/levels/begin/SleepingBall'
import Slot from '@/ts/draw-mode/levels/begin/Slot'
import SlotNoDraw from '@/ts/draw-mode/levels/begin/SlotNoDraw'
import TargetBehindL from '@/ts/draw-mode/levels/begin/TargetBehindL'
import Windmill from '@/ts/draw-mode/levels/begin/Windmill'
import AnchorAbove from '@/ts/draw-mode/levels/bloom/AnchorAbove'
import AnchorAboveBlocked from '@/ts/draw-mode/levels/bloom/AnchorAboveBlocked'
import BallOnPlatform from '@/ts/draw-mode/levels/bloom/BallOnPlatform'
import BetweenWedges from '@/ts/draw-mode/levels/bloom/BetweenWedges'
import Cannon from '@/ts/draw-mode/levels/bloom/Cannon'
import CannonBackwards from '@/ts/draw-mode/levels/bloom/CannonBackwards'
import CannonHinged from '@/ts/draw-mode/levels/bloom/CannonHinged'
import NoDrawUnderneath from '@/ts/draw-mode/levels/bloom/NoDrawUnderneath'
import RaiseCorner from '@/ts/draw-mode/levels/bloom/RaiseCorner'
import RaiseT from '@/ts/draw-mode/levels/bloom/RaiseT'
import Scales from '@/ts/draw-mode/levels/bloom/Scales'
import ScalesSwap from '@/ts/draw-mode/levels/bloom/ScalesSwap'
import ScalesWeight from '@/ts/draw-mode/levels/bloom/ScalesWeight'
import SlottedWedge from '@/ts/draw-mode/levels/bloom/SlottedWedge'
import SuspendBetweenCliffs from '@/ts/draw-mode/levels/bloom/SuspendBetweenCliffs'
import WedgeFork from '@/ts/draw-mode/levels/bloom/WedgeFork'
import WedgeSandwich from '@/ts/draw-mode/levels/bloom/WedgeSandwich'

export type WorldData = {
  name: string,
  levelSpecs: LevelSpec[]
}

export const worlds: WorldData[] = [
  {
    name: 'begin',
    levelSpecs: [
      BallOnCube, BallOnFloor, BallInCup, NoDrawOverhang, BallBesideHill, BallUnderClutter,
      BallOnRope, NoDrawRamp, NoDrawRampTarget, SleepingBall, NoDrawAfterAwaken, Windmill,
      Slot, SlotNoDraw, Chasm, TargetBehindL, BallOnStilts, BalancedBetweenSticks
    ]
  },
  {
    name: 'bloom',
    levelSpecs: [
      Scales, ScalesSwap, ScalesWeight, SlottedWedge, WedgeSandwich, BetweenWedges,
      RaiseT, RaiseCorner, SuspendBetweenCliffs, CannonHinged, Cannon, CannonBackwards,
      NoDrawUnderneath, BallOnPlatform, AnchorAbove, AnchorAboveBlocked
    ]
  },
  {
    name: 'deepen',
    levelSpecs: [ WedgeFork, ]
  },
]