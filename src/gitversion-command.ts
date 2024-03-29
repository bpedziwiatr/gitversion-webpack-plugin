const util = require('util');
const exec = util.promisify(require('child_process').exec);

export interface GitVersionModel {
  Major: number;
  Minor: number;
  Patch: number;
  PreReleaseTag: string;
  PreReleaseTagWithDash: string;
  PreReleaseLabel: string;
  PreReleaseLabelWithDash: string;
  PreReleaseNumber: number;
  WeightedPreReleaseNumber: number;
  BuildMetaData?: any;
  BuildMetaDataPadded: string;
  FullBuildMetaData: string;
  MajorMinorPatch: string;
  SemVer: string;
  LegacySemVer: string;
  LegacySemVerPadded: string;
  AssemblySemVer: string;
  AssemblySemFileVer: string;
  FullSemVer: string;
  InformationalVersion: string;
  BranchName: string;
  EscapedBranchName: string;
  Sha: string;
  ShortSha: string;
  NuGetVersionV2: string;
  NuGetVersion: string;
  NuGetPreReleaseTagV2: string;
  NuGetPreReleaseTag: string;
  VersionSourceSha: string;
  CommitsSinceVersionSource: number;
  CommitsSinceVersionSourcePadded: string;
  UncommittedChanges: number;
  CommitDate: string;
}
export class GitVersionCommand {
  private useDotnet: boolean;
  constructor(useDotnet: boolean) {
    this.useDotnet = useDotnet;
  }
  async getVersion(): Promise<GitVersionModel> {
    if (this.useDotnet === true) {
      return this.getVersionDotnet();
    } else {
      return this.getVersionExe();
    }
  }
  async getVersionExe(): Promise<GitVersionModel> {
    const { stdout, stderr } = await exec('gitversion');
    if (stderr === null) {
      throw Error(stderr);
    }
    const gitversion = JSON.parse(stdout);
    return gitversion;
  }
  async getVersionDotnet(): Promise<GitVersionModel> {
    const { stdout, stderr } = await exec('dotnet-gitversion');
    if (stderr === null) {
      throw Error(stderr);
    }
    const gitversion = JSON.parse(stdout);
    return gitversion;
  }
}
